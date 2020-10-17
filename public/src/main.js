function openNav() {
    document.getElementById('sidepanel').style.width = '350px';
}

function closeNav() {
    document.getElementById('sidepanel').style.width = '0';
}

function parseRep() {
    console.log(document.getElementById('searchbar').value);
}

function repSearch() {
    let results = document.getElementById('results');
    let resultsContainer = document.getElementById('rep-table-container');
    results.style.height = '0';
    results.style.maxHeight = '0';
    resultsContainer.style.overflowY = 'hidden';

    let query = document.getElementById('searchbar').value;
    if (query.length == 0) {
        return;
    }

    fetch('/api/repSearch', {
        method: 'POST',
        headers: {
            'Accept-Type': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            address: query,
            levels: [ 'country', 'administrativeArea1' ],
            roles: [ 'headOfGovernment', 'deputyHeadOfGovernment', 'legislatorUpperBody', 'legislatorLowerBody' ]
        })
    })
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            let table = document.getElementById('rep-table').getElementsByTagName('tbody')[0];
            let labels = document.getElementById('rep-labels');
            let error = document.getElementById('rep-error');
            table.innerHTML = '';
            labels.style.display = 'none';
            error.style.display = 'none';

            setTimeout(() => {
                results.style.height = 'auto';
                results.style.maxHeight = '750px';
                setTimeout(() => {
                    resultsContainer.style.overflowY = 'auto';
                }, 500);
            }, 300);

            if (res.status == 'success') {
                const offices = res.body.offices;
                const officials = res.body.officials;

                if (officials) {
                    labels.style.display = 'table-row';
                    offices.reverse();

                    offices.forEach((office) => {
                        office.officialIndices.forEach((i) => {
                            let newRep = table.insertRow();
                            let rep = officials[i];

                            let profileCol = newRep.insertCell();
                            let photo = document.createElement('img');
                            photo.src = rep.photoUrl || 'img/blank_profile.png';

                            let name = document.createTextNode(rep.name + ' ');
                            let party = document.createElement('a');
                            party.textContent = '(' + rep.party[0] + ')';
                            party.title = rep.party;

                            profileCol.append(photo, name, party);

                            let officeCol = newRep.insertCell();
                            officeCol.append(document.createTextNode(office.name));

                            let addressCol = newRep.insertCell();
                            if (rep.address) {
                                let address = [];
                                let addressRaw = rep.address[0];
                                for (let x in addressRaw) {
                                    if (addressRaw[x].length) {
                                        address.push(rep.address[0][x]);
                                    }
                                }
                                addressCol.append(
                                    document.createTextNode(address.slice(0, -3).join(', ')),
                                    document.createElement('br'),
                                    document.createTextNode(address.slice(-3).join(', '))
                                );
                            } else {
                                addressCol.append(document.createTextNode('Unavailable'));
                            }

                            let contactCol = newRep.insertCell();
                            let icons = [
                                'img/phone.png',
                                'img/email.png',
                                'img/globe.png',
                                'img/facebook.png',
                                'img/twitter.png'
                            ].map((v) => {
                                let icon = document.createElement('img');
                                icon.className = 'icon';
                                icon.src = v;
                                return icon;
                            });

                            let phone = document.createElement('a');
                            phone.target = '_blank';
                            if (rep.phones) {
                                phone.href = 'https://www.whitepages.com/phone/' + rep.phones[0];
                                phone.appendChild(icons[0]);
                            }

                            let email = document.createElement('a');
                            email.target = '_blank';
                            if (rep.emails) {
                                email.href = 'mailto:' + rep.emails.join(',');
                                email.appendChild(icons[1]);
                            }

                            let url = document.createElement('a');
                            url.target = '_blank';
                            if (rep.urls) {
                                url.href = rep.urls[0];
                                url.appendChild(icons[2]);
                            }

                            contactCol.append(phone, email, url);

                            if (rep.channels) {
                                rep.channels.forEach((channel) => {
                                    let social = document.createElement('a');
                                    social.target = '_blank';

                                    if (channel.type == 'Facebook') {
                                        social.href = 'https://www.facebook.com/' + channel.id;
                                        social.appendChild(icons[3]);
                                    }

                                    if (channel.type == 'Twitter') {
                                        social.href = 'https://twitter.com/' + channel.id;
                                        social.appendChild(icons[4]);
                                    }

                                    contactCol.appendChild(social);
                                });
                            }
                        });
                    });
                } else {
                    error.style.display = 'table';
                    error.getElementsByTagName('th')[0].textContent = 'No search results';
                }
            } else {
                error.style.display = 'table';
                error.getElementsByTagName('th')[0].textContent = 'Invalid address';
            }
        });
}

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
            let table = document.getElementById('news-table').getElementsByTagName('tbody')[0];
            if (res.status == 'success') {
                const articles = res.body.articles;
                articles.forEach((article) => {
                    let newArticle = table.insertRow();

                    let titleCol = newArticle.insertCell();
                    let title = document.createElement('a');
                    title.target = '_blank';
                    title.href = article.url;
                    title.append(document.createTextNode(article.title));
                    titleCol.append(title);

                    let dateCol = newArticle.insertCell();
                    dateCol.style = 'text-align: center';
                    let date = article.publishedAt.split(' ')[0].split('-').slice(1, 3).join('/');
                    dateCol.append(document.createTextNode(date));

                    let sourceCol = newArticle.insertCell();
                    sourceCol.style = 'text-align: right';
                    let source = document.createElement('a');
                    source.target = '_blank';
                    source.href = article.source.url;
                    source.append(document.createTextNode(article.source.name));
                    sourceCol.append(source);
                });
            }
        });
}
