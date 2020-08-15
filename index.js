require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const port = process.env.PORT || 5500;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use(function (req, res, next) {
	res.set({
		"Cache-Control": "no-cache, no-store, must-revalidate",
		Pragma: "no-cache",
		Expires: "0"
	});
	next();
});

app.use(express.static('public', {
    extensions: ['html', 'htm']
}));

const ClientManager = require("./src/ClientManager.js");
const cm = new ClientManager();

app.post("/api/repSearch", require("./src/actions/repSearch.js")(cm));

app.use((req, res) => {
	res.sendStatus(404);
});

app.listen(port, function () {
	console.log("App listening on port " + port);
});
