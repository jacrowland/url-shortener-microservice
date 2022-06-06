const express = require("express");
const router = express.Router();
const path = require('path');

const createAndSaveShortUrl = require("../controllers/index.js").createAndSaveShortUrl;
router.post("/api/shorturl", (req, res) => {
    const url = req.body.url;
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

const findByShortUrl = require("../controllers/index.js").findByShortUrl;
router.get("/api/shorturl/:url", (req, res) => {
    const url = req.params.url;
    findByShortUrl(url, (err, data) => {
        (err) ? res.json({ error: 'invalid url' }) : res.redirect(data.original_url);
    });
});

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
  
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = router;