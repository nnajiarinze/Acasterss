const request = require('supertest');
const express = require('express');
const app = require('../src/app');
var assert = require('assert');
const nock = require('nock');
const { Worker } = require('jest-worker');
var rewire = require("rewire");

var utility = rewire("../src/utilities/utility");

beforeEach(() => {
    utility.__set__("downloadImage", {
        downloadImage: function(mp3Url, fileName) {
 
         }
    });

   
    nock('https://rss.acast.com/')
    .get('/varvet')
    .reply(200, "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<rss version=\"2.0\"\n\txmlns:atom=\"http://www.w3.org/2005/Atom\"\n\txmlns:itunes=\"http://www.itunes.com/dtds/podcast-1.0.dtd\" \n\txmlns:acast=\"https://schema.acast.com/1.0/\"  >\n\t<channel>\n\t\t<title>Värve  ddt</title>\n\t\t<item>\n\t\t\t<title>Värvet ru   saant: 1</title>\n\t\t\t<acast:episodeUrl>varvetrunt-1</acast:episodeUrl>\n\t\t\t<pubDate>Thu, 12 Mar 2020 02:00:00 GMT</pubDate> \n\t\t\t<enclosure url=\"https://media.acast.com/varvet/varvetrunt-1/media.mp3\" length=\"102559808\" type=\"audio/mpeg\"/>\n\t\t</item>\n\t</channel>\n</rss>")

    nock('https://rss.acast.com/')
    .get('/varvet1')
    .reply(200, "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<rss version=\"2.0\"\n\txmlns:atom=\"http://www.w3.org/2005/Atom\"\n\txmlns:itunes=\"http://www.itunes.com/dtds/podcast-1.0.dtd\" \n\txmlns:acast=\"https://schema.acast.com/1.0/\"  >\n\t<channel>\n\t\t<title>Värve  ddt</title>\n\t\t \n\t</channel>\n</rss>")
})


test('Should return bad request', async() => {
    const response = await request(app)
                    .post('/rss')
                    .send({
                        
                    })
                    .expect(400);
                    assert(response.body.message, 'url not provided');

});


test('Should return no feed found', async() => {
    const response = await request(app)
                    .post('/rss')
                    .send({
                        url: 'https://rss.acast.com/varvet1'
                    })
                    .expect(200);
                    assert(response.body.message, 'no feed found at the given url')
                   

});

test('Should pass', async() => {
    const response = await request(app)
                    .post('/rss')
                    .send({
                        url: 'https://rss.acast.com/varvet'
                    })

                    .expect(200);
                    assert(response.body[0].checksum != null)  

});