
require('dotenv').config();
const { nanoid } = require("nanoid");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const shortUrlSchema = new Schema({
    short_url: String,
    original_url: String
});

let ShortUrl = mongoose.model('ShortURL', shortUrlSchema); 

function createAndSaveShortUrl(originalUrl, done) {
    const shortenedUrl = nanoid(10);
    console.log(originalUrl, shortenedUrl);
    let document = new ShortUrl({original_url: originalUrl, short_url: shortenedUrl});
    let data = document.save((err, data) => {
        err ? done(null, err) : done(null, data)
      });
}

function findByShortUrl(url, done) {
    ShortUrl.findOne({short_url: url}, (err, data) => {
        err ? done(err, null) : done(null, data);
    });
}

function findbyOriginalUrl(url, done) {
    ShortUrl.findOne({original_url: url}, (err, data) => {
        err ? done(err, null) : done(null, data);
    });
}

exports.createAndSaveShortUrl = createAndSaveShortUrl;
exports.findByShortUrl = findByShortUrl;
exports.findbyOriginalUrl = findbyOriginalUrl;
