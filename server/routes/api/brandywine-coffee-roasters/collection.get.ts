import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

export default defineEventHandler(async () =>{
    const baseUrl = 'https://www.brandywinecoffeeroasters.com';
    const collectionRoute = baseUrl+'/collections/all-coffee-1';

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
        
        $('.grid-product').each((index, element) => {
            let name = $(element).find('.grid-product__title').first().text().trim();
            let image = $(element).find('.grid-product__image-mask div.image-wrap img').attr('src');
            let price = $(element).find('.grid-product__price span').text().trim();
            let productUrl = $(element).find('a.grid-product__link').attr('href');
            
            const product = {
                name: name,
                image: 'https:'+image,
                price: price,
                url: baseUrl + productUrl,
                details_card: ''
            };

            products.push(product);
        });

        return products;

    } catch (error) {
        return error.message;
    }
})