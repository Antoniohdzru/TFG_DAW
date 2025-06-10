// Importar módulos necesarios
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const cheerio = require('cheerio');
const cors = require('cors'); 

// Configuración  Express
const app = express();
const PORT = process.env.PORT || 3000;

// Express 
app.use(cors()); 
app.use(express.json());
app.use(express.static('public'));

// Configuración del Cliente de Supabase 
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error(" Error : Faltan las variables de entorno de Supabase.");
    process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Configuración de ScrapingBot 
const scrapingBotUsername = process.env.SCRAPINGBOT_USERNAME;
const scrapingBotApiKey = process.env.SCRAPINGBOT_API_KEY;
const scrapingBotRawHtmlUrl = 'http://api.scraping-bot.io/scrape/raw-html';

if (!scrapingBotUsername || !scrapingBotApiKey) {
    console.error(" Error : Faltan las credenciales de ScrapingBot.");
    process.exit(1);
}
const scrapingBotAuth = 'Basic ' + Buffer.from(`${scrapingBotUsername}:${scrapingBotApiKey}`).toString('base64');


// Funciones de Parseo 
function parsePullAndBearHTML(html, baseUrl) {
    const $ = cheerio.load(html);
    let products = [];
    console.warn('[Pull&Bear] Usando parseo HTML tradicional...');
    $('div.product_item-container').each((index, element) => {
        const $element = $(element);
        const name = $element.find('a.product_name-link > span').text().trim();
        let product_url = $element.find('a.product_name-link').attr('href');
        if (product_url && !product_url.startsWith('http')) {
            try { product_url = new URL(product_url, baseUrl).href; } catch (e) { product_url = null; }
        }
        if (name && product_url) {
            products.push({ name, brand: 'Pull&Bear', product_url, price: 'Consultar en web (HTML)' });
        }
    });
    console.log(`[Pull&Bear] Parseados (final): ${products.length} productos.`);
    return products.slice(0, 5);
}

function parseAdidasHTML(html, baseUrl) {
    const $ = cheerio.load(html);
    const products = [];
    $('div[data-auto-id="product_container"] article, div[class*="product-card___"], div.plp-image-square-hover_container___Cr1Gq').each((index, element) => {
        const $element = $(element);
        const name = $element.find('p[data-auto-id="product_name"], div[class*="product_card_title"], a[data-auto-id="glass-hockeycard-link"] > p:first-child, .glass-product-card__title').first().text().trim();
        let product_url = $element.find('a').first().attr('href');
        if (product_url && !product_url.startsWith('http')) {
             try { product_url = new URL(product_url, baseUrl).href; } catch (e) { product_url = null; }
        }
        if (name && product_url) {
            products.push({
                name, brand: 'Adidas', product_url,
                price: $element.find('.gl-price__value, .gl-price-item, .money-value').first().text().trim() || 'Consultar en web',
            });
        }
    });
    console.log(`[Adidas] Parseados (HTML): ${products.length} productos.`);
    return products.slice(0, 5);
}


// Lógica Principal de Búsqueda y Scraping 
async function findProducts(query) {
    const searchTerm = query.toLowerCase().trim();
    console.log(`Buscando en Supabase por: "${searchTerm}"`);
    const { data: dbProducts, error: dbError } = await supabase.from('products').select('name, brand, product_url, image_url, price').or(`name.ilike.%${searchTerm}%,search_keyword.eq.${searchTerm}`);
    if (dbError) { console.error(' Error buscando en Supabase:', dbError.message); }
    if (dbProducts && dbProducts.length > 0) {
        console.log(` Encontrados ${dbProducts.length} productos en Supabase.`);
        return { source: 'database', data: dbProducts };
    }
    console.log(` No hay resultados en BD. Iniciando scraping...`);
    const sitesToScrape = [
        { name: 'Pull&Bear', searchUrl: `https://www.pullandbear.com/es/es/search?q=${encodeURIComponent(searchTerm)}`, baseUrl: 'https://www.pullandbear.com', parser: parsePullAndBearHTML, useChrome: false },
        { name: 'Adidas', searchUrl: `https://www.adidas.es/search?q=${encodeURIComponent(searchTerm)}`, baseUrl: 'https://www.adidas.es', parser: parseAdidasHTML, useChrome: true },
        { name: 'Zara', searchUrl: `https://www.zara.com/es/es/search?searchTerm=${encodeURIComponent(searchTerm)}`, baseUrl: 'https://www.zara.com', parser: parseZaraHTML, useChrome: true }
    ];
    let allScrapedProducts = [];
    for (const site of sitesToScrape) {
        try {
            const response = await axios.post(scrapingBotRawHtmlUrl, { url: site.searchUrl, useChrome: site.useChrome || false }, { headers: { 'Authorization': scrapingBotAuth, 'Content-Type': 'application/json' }, timeout: 60000 });
            if (response.data) {
                const productsFromSite = site.parser(response.data, site.baseUrl);
                const productsWithKeyword = productsFromSite.map(p => ({ ...p, search_keyword: searchTerm }));
                allScrapedProducts = allScrapedProducts.concat(productsWithKeyword);
            }
        } catch (scrapeError) {
            console.error(` Error scrapeando ${site.name}`);
        }
    }
    if (allScrapedProducts.length > 0) {
        console.log(`Guardando ${allScrapedProducts.length} productos...`);
        await supabase.from('products').upsert(allScrapedProducts, { onConflict: 'product_url', ignoreDuplicates: true });
    }
    return { source: 'scraper', data: allScrapedProducts };
}


// Endpoint de la API de Búsqueda 
app.get('/search', async (req, res) => {

    const query = req.query.q;
    if (!query || query.trim() === '') { return res.status(400).json({ error: 'Query "q" es requerido.' }); }
    try {
        const result = await findProducts(query);
        if (result.data.length === 0 && result.source === 'scraper') { return res.json({ ...result, message: `No se encontraron productos para "${query}".` }); }
        res.json(result);
    } catch (error) {
        console.error(' Error en /search:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});


// Endpoint para productos aleatorios
app.get('/api/products/random', async (req, res) => {
    const limit = req.query.limit || 8;
    try {
        const { data, error } = await supabase.rpc('get_random_products', { limit_count: limit });
        if (error) { throw error; }
        res.json({ data });
    } catch (error) {
        console.error(' Error obteniendo productos aleatorios:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Endpoint para productos por marca
app.get('/api/products/brand/:brandName', async (req, res) => {
    const { brandName } = req.params;
    const limit = req.query.limit || 20; 

    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .ilike('brand', brandName) 
            .limit(limit);

        if (error) { throw error; }

        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor al obtener productos por marca.' });
    }
});


// Iniciar el Servidor 
app.listen(PORT, () => {
    console.log(` Backend furulando en http://localhost:${PORT}`);
});