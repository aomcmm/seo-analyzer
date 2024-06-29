const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/analyze', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const title = $('title').text();
        const metaDescription = $('meta[name="description"]').attr('content');
        const h1 = $('h1').text();
        const h2 = $('h2').text();

        const result = {
            title: title || 'N/A',
            titleLength: title.length || 0,
            metaDescription: metaDescription || 'N/A',
            metaDescriptionLength: metaDescription ? metaDescription.length : 0,
            h1: h1 || 'N/A',
            h2: h2 || 'N/A'
        };

        res.json(result);
    } catch (error) {
        res.status(500).send('Error fetching the URL');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
