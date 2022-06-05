require('dotenv').config();
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('1234567890', 9)

const mongoose = require("mongoose");
const { Schema } = mongoose;

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const shortUrlSchema = new Schema({
    short_url: Number,
    original_url: String
});

let ShortUrl = mongoose.model('ShortURL', shortUrlSchema); 

function createAndSaveShortUrl(originalUrl, done) {
    // is the url already in the db?
    findbyOriginalUrl(originalUrl, (err, data) => {
        if (data) {
            return done(null, data);
        }
        else {
            // if not create it
            const shortenedUrl = parseInt(nanoid());
            let document = new ShortUrl({original_url: originalUrl, short_url: shortenedUrl});
            let data = document.save((err, data) => {
                err ? done(null, err) : done(null, data)
            });
        }
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
