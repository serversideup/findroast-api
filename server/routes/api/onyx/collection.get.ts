import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

export default defineEventHandler(async () =>{
    const baseUrl = 'https://onyxcoffeelab.com';
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
        
        $('a.product-preview').each((index, element) => {
            let name = $(element).find('.product-meta .title').text().trim();
            let image = $(element).find('.product-image img').not('.alt-image').attr('src');
            let price = $(element).find('.product-meta .price').text().trim();
            let productUrl = $(element).attr('href');
            
            // There are ads mid collection. The difference is there is no name.
            if( name.trim() != '' ){
                const product = {
                    name: name,
                    image: 'https:'+image,
                    price: price,
                    url: baseUrl + productUrl,
                    details_card: ''
                };

                products.push(product);
            }
        });

        return products;

    } catch (error) {
        return error.message;
    }
})