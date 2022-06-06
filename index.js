require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const fs = require('fs');
const router = require("./server/routes/index");

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
  var content = `${Date()}: ${req.method} ${req.path} - ${req.ip} - ${req.body.URL}\n`;
  console.log(`${Date()}: ${req.method} ${req.path} - ${req.ip}`)
  try {
    fs.writeFile('logs.txt', content, { flag: 'a+' }, err => {});
    // file written successfully
  } catch (err) {
    console.error(err);
  }
  next();
});

app.use(router);


