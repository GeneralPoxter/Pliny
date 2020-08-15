function openNav() {
    document.getElementById("sidepanel").style.width = "300px";
}

function closeNav() {
    document.getElementById("sidepanel").style.width = "0";
}

function parseRep() {
    console.log(document.getElementById("searchbar").value);
}

function repSearch() {
    let results = document.getElementById("results");
    let resultsContainer = document.getElementById("rep-table-container");
    results.style.height = "0";
    results.style.maxHeight = "0";
    resultsContainer.style.overflowY = "hidden";

    let query = document.getElementById("searchbar").value;
    if (query.length == 0) {
        return;
    }

    fetch("/api/repSearch", {
        method: "POST",
        headers: {
            "Accept-Type": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            address: query,
            levels: ["country", "administrativeArea1"],
            roles: ["headOfGovernment", "deputyHeadOfGovernment", "legislatorUpperBody", "legislatorLowerBody",]
        })
    })
        .then(res => {
            return res.json();
        })
        .then(res => {
            let table = document.getElementById("rep-table").getElementsByTagName("tbody")[0];
            let labels = document.getElementById("rep-labels");
            let error =  document.getElementById("rep-error");
            table.innerHTML = "";
            labels.style.display = "none";
            error.style.display = "none";

            setTimeout(() => {
                results.style.height = "auto";
                results.style.maxHeight = "500px";
                setTimeout(() => {
                    resultsContainer.style.overflowY = "auto";
                }, 500);
            }, 300);

            if (res.status == "success") {
                const offices = res.body.offices;
                const officials = res.body.officials;
                if (officials) {
                    labels.style.display = "table-row";
                    offices.reverse();
                    offices.forEach(office => {
                        office.officialIndices.forEach(i => {
                            let newRep = table.insertRow();
                            let rep = officials[i];
    
                            let profileCol = newRep.insertCell();
                            let img = document.createElement("img");
                            img.src = "img/blank_profile.png";
                            if (rep.photoUrl) {
                                img.src = rep.photoUrl;
                            }
                            let name = document.createTextNode(rep.name + " ");
                            let party = document.createElement("a");
                            party.textContent = "(" + rep.party[0] + ")";
                            party.title = rep.party;
                            profileCol.append(
                                img,
                                name,
                                party
                            );
    
                            let officeCol = newRep.insertCell();
                            officeCol.append(
                                document.createTextNode(office.name)
                            );
    
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
                                    document.createTextNode(address.slice(0, -3).join(", ")),
                                    document.createElement("br"),
                                    document.createTextNode(address.slice(-3).join(", "))
                                );
                            } else {
                                addressCol.append(
                                    document.createTextNode("Unavailable")
                                );
                            }
    
                            let contactCol = newRep.insertCell();
                            let icons = ["img/globe.png", "img/email.png", "img/facebook.png", "img/twitter.png"]
                            for (e=0; e<icons.length; e++) {
                                let icon = document.createElement("img");
                                icon.className = "icon";
                                icon.src = icons[e];
                                icons[e] = icon;
                            }
                            let url = document.createElement("a");
                            url.target = "_blank";
                            if (rep.urls) {
                                url.href = rep.urls[0];
                                url.appendChild(icons[0]);
                            }
                            let email = document.createElement("a");
                            email.target = "_blank";
                            if (rep.emails) {
                                email.href = "mailto:" + rep.emails.join(",");
                                email.appendChild(icons[1]);
                            }
                            contactCol.append(
                                url,
                                email
                            );
                            if (rep.channels) {
                                rep.channels.forEach(channel => {
                                    let social = document.createElement("a");
                                    social.target = "_blank";
    
                                    if (channel.type == "Facebook") {
                                        social.href = "https://www.facebook.com/" + channel.id;
                                        social.appendChild(icons[2]);
                                    }
    
                                    if (channel.type == "Twitter") {
                                        social.href = "https://twitter.com/" + channel.id;
                                        social.appendChild(icons[3]);
                                    }
    
                                    contactCol.appendChild(social);
                                });
                            }
                        });
                    });
                } else {
                    error.style.display = "table";
                    error.getElementsByTagName("th")[0].textContent = "No search results";
                }
            } else {
                error.style.display = "table";
                error.getElementsByTagName("th")[0].textContent = "Invalid address";
            }
        });
}