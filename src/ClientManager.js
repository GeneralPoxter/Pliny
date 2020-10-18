const { google } = require('googleapis');
const fetch = require('node-fetch');

const civicinfo = google.civicinfo({
    version: 'v2',
    auth: process.env.GOOGLE_API_KEY
});

const DEBUG = false;

const SUCCESS = 'success';

const sources = [
    'abc-news',
    'associated-press',
    'bloomberg',
    'business-insider',
    'cbs-news',
    'cnn',
    'fox-news',
    'national-review',
    'nbc-news',
    'politico',
    'reuters',
    'the-hill',
    'the-wall-street-journal',
    'the-washington-post',
    'time',
    'usa-today'
];

class ClientManager {
    async repSearch(data) {
        const res = await civicinfo.representatives
            .representativeInfoByAddress({
                address: data.address,
                levels: data.levels,
                roles: data.roles
            })
            .catch((err) => {
                if (DEBUG) {
                    console.error(err);
                }
                throw err;
            });
        return res.data;
    }

    async getNews() {
        const res = await fetch(
            `http://newsapi.org/v2/top-headlines?sources=${sources.join(',')}&apiKey=${process.env.NEWS_API_KEY}`
        );
        return res.json();
    }
}

ClientManager.SUCCESS = SUCCESS;

module.exports = ClientManager;
