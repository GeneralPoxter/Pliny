function getNews(cm) {
    return async function(req, res) {
        try {
            const data = await cm.getNews(req.body.articles);
            res.json({
                status: 'success',
                body: data
            });
        } catch (e) {
            res.status(400).json({
                status: 'error',
                error: e
            });
        }
    };
}

module.exports = getNews;
