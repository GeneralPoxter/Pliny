const {google} = require('googleapis');
const key = process.env.API_KEY;

const civicinfo = google.civicinfo({
  version: 'v2',
  auth: key
});

const DEBUG = false;

const SUCCESS = "success";

class ClientManager {
    async repSearch(data) {
        const res = await civicinfo.representatives.representativeInfoByAddress({
            address: data.address,
            levels: data.levels,
            roles: data.roles
        }).catch(e => {
            if (DEBUG) {
                console.error(e);
            }
            throw e;
        });
        return res.data;
    }
}

ClientManager.SUCCESS = SUCCESS;

module.exports = ClientManager;