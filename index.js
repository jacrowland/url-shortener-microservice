require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const dns = require('node:dns');

let app = express();

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
    console.log('Listening at http://%s:%s', server.address().address, server.address().port);
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
    const hostname = require('url').parse(url).hostname;
    dns.lookup(hostname, (err, address, family) => {
        console.log('address: %j family: IPv%s', address, family);
        if (err) {
            return res.json({error: 'invalid url'})
        }
        else {
            createAndSaveShortUrl(url, (err, data) => {
                res.json(data);
            });
        }
      });
});

const findByShortUrl = require("./handlers.js").findByShortUrl;
app.get("/api/shorturl/:URL", (req, res) => {
    const url = req.params.URL;
    findByShortUrl(url, (err, data) => {
        (err || data === null) ? res.json({ error: 'invalid url' }) : res.redirect(data.original_url);
    });
});