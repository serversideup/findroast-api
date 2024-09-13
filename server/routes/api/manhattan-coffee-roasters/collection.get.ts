import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

export default defineEventHandler(async () =>{
    const baseUrl = 'https://manhattancoffeeroasters.com';
    const collectionRoute = baseUrl+'/catalog/coffee';

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

        $('.max-w-screen-xl.mx-auto.px-6 a').each( (index, element) => {
            let productUrl = $(element).attr('href');
            let name = $(element).find('h1').text().trim();
            
            const product = {
                name: name,
                image: null,
                price: null,
                url: productUrl,
                details_card: ''
            }

            products.push(product);

        });
        
        // We need to return the HTML so the AI can extract the details.

        return products;

    } catch (error) {
        return error.message;
    }
});