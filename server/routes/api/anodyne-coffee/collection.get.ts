import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

export default defineEventHandler(async () =>{
    const baseUrl = 'https://anodynecoffee.com';
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
        
        $('ul#product-grid li.grid__item').each((index, element) => {
            let name = $(element).find('div.card__content div.card__information h3.card__heading a').first().text().trim();
            let image = $(element).find('.card__media img').attr('src');
            let price = $(element).find('.price__container .price__regular .price-item').text().trim().replace('From', '').trim();
            let productUrl = $(element).find('div.card__content div.card__information h3.card__heading a').attr('href');
            
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