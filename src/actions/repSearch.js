function repSearch(cm) {
    return async function(req, res) {
        if (req.body.address && req.body.levels && req.body.roles) {
            try {
                const info = await cm.repSearch(req.body);
                res.json({
                    status: 'success',
                    body: info
                });
            } catch (e) {
                res.status(400).json({
                    status: 'error',
                    error: e.errors
                });
            }
        } else {
            res.status(400).json({
                status: 'error',
                error: 'incomplete request'
            });
        }
    };
}

module.exports = repSearch;
