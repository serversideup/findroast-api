import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

export default defineEventHandler(async () =>{
    const baseUrl = 'https://www.saintfrankcoffee.com';
    const collectionRoute = baseUrl+'/collections/our-coffees';

    try {
        const browser = await puppeteer.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        });
        const page = await browser.newPage();
        
        await page.goto(collectionRoute, {
            waitUntil: 'networkidle2' 
        });
        
        const content = await page.content();
        await browser.close();
    
        const $ = cheerio.load(content);
    
        const products = [];
        
        $('.collection-products .product-list-item').each((index, element) => {
            let name = $(element).find('h3.product-list-item-title a').first().text().trim();
            let price = $(element).find('span.money').text().trim();
            let productUrl = $(element).find('h3.product-list-item-title a').attr('href');

            const product = {
                name: name,
                price: price,
                url: baseUrl + productUrl,
            };

            products.push(product);
        });

        return products;

    } catch (error) {
        return error.message;
    }
})