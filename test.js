const phantom = require('phantom');
const fs = require('fs');
const path = require('path')
const filePath = path.join(__dirname, 'files', 'mro.json');

const cheerio = require('cheerio');
const request = require('request-promise');


console.log(filePath);
var json = [];
var arr;

fs.readFile(filePath, {encoding: 'utf-8'}).then(result => {
    json = JSON.parse(data);
    arr = json.Sheet1.map(data => {
        return data.mandal;
    });
});

// locality ~ name and adminDistrict is AP.


