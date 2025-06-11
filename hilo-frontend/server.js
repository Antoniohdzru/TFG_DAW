require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const scrapingBotUsername = process.env.SCRAPINGBOT_USERNAME;
const scrapingBotApiKey = process.env.SCRAPINGBOT_API_KEY;
const scrapingBotRawHtmlUrl = 'http://api.scraping-bot.io/scrape/raw-html';
const scrapingBotAuth = 'Basic ' + Buffer.from(`${scrapingBotUsername}:${scrapingBotApiKey}`).toString('base64');

// --- Funciones de Parseo ---

function parsePullAndBearHTML(html, baseUrl) {
    const $ = cheerio.load(html);
    let products = [];
    $('div.product_item-container').each((index, element) => {
        const $element = $(element);
        const name = $element.find('a.product_name-link > span').text().trim();
        let product_url = $element.find('a.product_name-link').attr('href');
        if (product_url && !product_url.startsWith('http')) {
            try { product_url = new URL(product_url, baseUrl).href; } catch (e) { product_url = null; }
        }
        if (name && product_url) {
            products.push({ name, brand: 'Pull&Bear', product_url, price: 'Consultar en web' });
        }
    });
    console.log(`[Pull&Bear] Parseados: ${products.length} productos.`);
    return products.slice(0, 5);
}

function parseAdidasHTML(html, baseUrl) {
    const $ = cheerio.load(html);
    const products = [];
    $('div[data-auto-id="product_container"] article, div[class*="product-card___"]').each((index, element) => {
        const $element = $(element);
        const name = $element.find('p[data-auto-id="product_name"], div[class*="product_card_title"]').first().text().trim();
        let product_url = $element.find('a').first().attr('href');
        if (product_url && !product_url.startsWith('http')) {
             try { product_url = new URL(product_url, baseUrl).href; } catch (e) { product_url = null; }
        }
        if (name && product_url) {
            products.push({
                name, brand: 'Adidas', product_url,
                price: $element.find('.money-amount__main').first().text().trim() || 'Consultar en web',
            });
        }
    });
    console.log(`[Adidas] Parseados: ${products.length} productos.`);
    return products.slice(0, 5);
}

// 🔥 LA FUNCIÓN QUE FALTABA 🔥
function parseZaraHTML(html, baseUrl) {
    const $ = cheerio.load(html);
    const products = [];
    
    $('li.product-grid__product-list-item article[data-productid]').each((index, element) => {
        const $element = $(element);
        const name = $element.find('.product-card-info__name').text().trim();
        let product_url = $element.find('a.product-card-link').attr('href');
        const price = $element.find('.money-amount__main').text().trim();
        const image_url = $element.find('img.media-image__image').attr('src');

        if (name && product_url) {
            products.push({
                name,
                brand: 'Zara',
                product_url,
                image_url: image_url ? `https:${image_url}` : null,
                price: price || 'Consultar',
            });
        }
    });
    console.log(`[Zara] Parseados: ${products.length} productos.`);
    return products.slice(0, 5);
}

// --- Lógica de Búsqueda y Scraping ---
async function findProducts(query) {
    const searchTerm = query.toLowerCase().trim();
    const { data: dbProducts } = await supabase.from('products').select('name, brand, product_url, image_url, price').or(`name.ilike.%${searchTerm}%,search_keyword.eq.${searchTerm}`);

    if (dbProducts && dbProducts.length > 0) {
        return { source: 'database', data: dbProducts };
    }
    
    const sitesToScrape = [
        // Ahora, al llamar a parseZaraHTML, la función sí existe
        { name: 'Zara', searchUrl: `https://www.zara.com/es/es/search?searchTerm=${encodeURIComponent(searchTerm)}`, baseUrl: 'https://www.zara.com', parser: parseZaraHTML, useChrome: true },
        { name: 'Pull&Bear', searchUrl: `https://www.pullandbear.com/es/es/search?q=${encodeURIComponent(searchTerm)}`, baseUrl: 'https://www.pullandbear.com', parser: parsePullAndBearHTML, useChrome: false },
        { name: 'Adidas', searchUrl: `https://www.adidas.es/search?q=${encodeURIComponent(searchTerm)}`, baseUrl: 'https://www.adidas.es', parser: parseAdidasHTML, useChrome: true },
    ];

    let allScrapedProducts = [];
    for (const site of sitesToScrape) {
        try {
            console.log(`🕸️  Scrapeando ${site.name}...`);
            const response = await axios.post(scrapingBotRawHtmlUrl, { url: site.searchUrl, useChrome: site.useChrome || false }, { headers: { 'Authorization': scrapingBotAuth, 'Content-Type': 'application/json' }, timeout: 90000 });
            if (response.data) {
                const productsFromSite = site.parser(response.data, site.baseUrl);
                const productsWithKeyword = productsFromSite.map(p => ({ ...p, search_keyword: searchTerm }));
                allScrapedProducts = allScrapedProducts.concat(productsWithKeyword);
            }
        } catch (scrapeError) {
            let errorMessage = scrapeError.message;
            if (scrapeError.response) { errorMessage = `Status: ${scrapeError.response.status}`; }
            console.error(`❌ Error scrapeando ${site.name}: ${errorMessage}`);
        }
    }
    if (allScrapedProducts.length > 0) {
        await supabase.from('products').upsert(allScrapedProducts, { onConflict: 'product_url', ignoreDuplicates: true });
    }
    return { source: 'scraper', data: allScrapedProducts };
}

// --- Endpoints de la API ---
app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query || query.trim() === '') { return res.status(400).json({ error: 'Query "q" es requerido.' }); }
    try {
        const result = await findProducts(query);
        if (result.data.length === 0 && result.source === 'scraper') { return res.json({ ...result, message: `No se encontraron productos para "${query}".` }); }
        res.json(result);
    } catch (error) {
        console.error(`Error en /search: ${error}`);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.get('/api/products/random', async (req, res) => {
    const limit = req.query.limit || 8;
    try {
        const { data, error } = await supabase.rpc('get_random_products', { limit_count: limit });
        if (error) { throw error; }
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.get('/api/products/brand/:brandName', async (req, res) => {
    const { brandName } = req.params;
    const limit = req.query.limit || 20;
    try {
        const { data, error } = await supabase.from('products').select('*').ilike('brand', brandName).limit(limit);
        if (error) { throw error; }
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// --- Iniciar el Servidor ---
app.listen(PORT, () => {
    console.log(`Backend furulando en http://localhost:${PORT}`);
});