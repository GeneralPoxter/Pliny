let articles;
const inc = 5;

function getNews() {
    fetch('/api/getNews', {
        method: 'POST',
        headers: {
            'Accept-Type': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            if (res.status == 'success') {
                articles = res.body.articles;
                loadNews();
            }
        });
}

function loadNews() {
    let table = document.getElementById('news-table').getElementsByTagName('tbody')[0];
    let limit = Math.min(table.rows.length + inc, articles.length);
    for (i = table.rows.length; i < limit; i++) {
        let newArticle = table.insertRow();
        let article = articles[i];

        let photoCol = newArticle.insertCell();
        photoCol.className = 'img';
        let photo = document.createElement('img');
        if (article.urlToImage && article.urlToImage != 'null') {
            photo.src = article.urlToImage;
        } else {
            photo.src = 'img/blank_news.png';
        }
        photoCol.append(photo);

        let titleCol = newArticle.insertCell();
        titleCol.className = 'ttl';
        let title = document.createElement('a');
        title.textContent = article.title;
        title.target = '_blank';
        title.href = article.url;
        if (article.description) {
            title.title = article.description;
        }
        titleCol.append(title);

        let sourceCol = newArticle.insertCell();
        sourceCol.className = 'src';
        sourceCol.append(document.createTextNode(article.source.name));
    }
    if (limit == articles.length) {
        let button = document.getElementById('dropdown');
        button.style = 'display: none';
    }
}