import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

export default defineEventHandler(async () =>{
    return 'here';
    // try {
    //     const url = 'https://onyxcoffeelab.com/collections/coffee';
    //     const browser = await puppeteer.launch({ 
    //         headless: true,
    //         args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    //     });
    //     const page = await browser.newPage();
        
    //     await page.goto(url, {
    //         waitUntil: 'networkidle2' 
    //     });
        
    //     const content = await page.content();
    //     await browser.close();
    
    //     const $ = cheerio.load(content);
    
    //     const products = [];
        
    //     $('a.product-preview').each((index, element) => {
    //         const product = {
    //             name: $(element).find('.title').text().trim(),
    //             image: $(element).find('img').not('.alt-image').attr('src'),
    //             price: $(element).find('.price').text().trim(),
    //             link: $(element).attr('href'),
    //         };

    //         products.push(product);
    //     });

    
    //     return products

    // } catch (error) {
    //     return error.message;
    // }
})