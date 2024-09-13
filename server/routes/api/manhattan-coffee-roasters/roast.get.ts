import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

export default defineEventHandler(async ( event ) =>{
    const query = getQuery(event);

    const roastUrl = query.url;

    try {
        const browser = await puppeteer.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        });
        const page = await browser.newPage();

        await page.goto(roastUrl, {
            waitUntil: 'networkidle2' 
        });

        const content = await page.content();
        await browser.close();

        const $ = cheerio.load(content);

        const roast = {
            url: roastUrl,
            flavor_notes: [],
            elevations: [],
            countries: [],
            processes: [],
            varieties: [],
            image: '',
            details_card: '',
            type: '',
            raw_text: $('article').html(),
            in_stock: true,
            details_map: {
                flavor_notes: 'raw-text',
                elevations: 'raw-text',
                countries: 'raw-text',
                processes: 'raw-text',
                varieties: 'raw-text'
            }
        };

        return roast;
    } catch (error) {
        return error.message;
    }
})