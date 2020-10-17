const { google } = require('googleapis');
const fetch = require('node-fetch');

const civicinfo = google.civicinfo({
    version: 'v2',
    auth: process.env.GOOGLE_API_KEY
});

const DEBUG = false;

const SUCCESS = 'success';

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
        const res = await fetch(`https://gnews.io/api/v3/top-news?token=${process.env.GNEWS_API_KEY}`);
        return res.json();
    }
}

ClientManager.SUCCESS = SUCCESS;

module.exports = ClientManager;
