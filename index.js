require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
let app = express();

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
    console.log('Listening at http://%s:%s', server.address().address, server.address().port);
});

app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });

const createAndSaveShortUrl = require("./handlers.js").createAndSaveShortUrl;
app.post("/api/shorturl", (req, res) => {
    const url = req.body.URL;
    const re = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
    if (!url.match(re)) return res.json({error: 'invalid url'});
    createAndSaveShortUrl(url, (err, data) => {
        res.json(data);
    });
});

const findByShortUrl = require("./handlers.js").findByShortUrl;
app.get("/api/shorturl/:URL", (req, res) => {
    const url = req.params.URL;
    findByShortUrl(url, (err, data) => {
        (err || data === null) ? res.json({ error: 'invalid url' }) : res.redirect(data.original_url);
    });
});