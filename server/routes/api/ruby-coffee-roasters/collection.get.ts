import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

export default defineEventHandler(async () =>{
    const baseUrl = 'https://rubycoffeeroasters.com';
    const collectionRoute = baseUrl+'/collections/coffee';

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
        
        $('.collection-products .product').each((index, element) => {
            let name = $(element).find('.product__title.h4').first().text().trim();
            // let images = $(element).find('.product__img-hover').attr('data-bgset')?.replace(/\s/g, '').split(',');
            let price = $(element).find('.product__price-price span').text().trim().replace('from', '').trim();
            let productUrl = $(element).find('a.product-link').attr('href');
            
            // let image = images ? images[ Math.round( images.length / 2 ) ]: '';

            const product = {
                name: name,
                // image: 'https:'+image,
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