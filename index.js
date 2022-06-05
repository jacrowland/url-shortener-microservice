require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const dns = require('node:dns');

let app = express();

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
    console.log('Listening at http://%s:%s', server.address().address, server.address().port);
});

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  });

app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${req.ip}`)
    next();
  });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });

const createAndSaveShortUrl = require("./handlers.js").createAndSaveShortUrl;
app.post("/api/shorturl", (req, res) => {
    const url = req.body.URL;
    const re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    if (re.test(url)) {
      createAndSaveShortUrl(url, (err, data) => {
        res.json({original_url: data.original_url, short_url: data.short_url});
    });
    }
    else {
      return res.json({error: 'invalid url'});
    }
});

const findByShortUrl = require("./handlers.js").findByShortUrl;
app.get("/api/shorturl/:URL", (req, res) => {
    const url = req.params.URL;
    findByShortUrl(url, (err, data) => {
        //(err || data === null) ? res.json({ error: 'invalid url' }) : res.redirect(data.original_url);
        (err) ? res.json({ error: 'invalid url' }) : res.redirect(data.original_url);
    });
});