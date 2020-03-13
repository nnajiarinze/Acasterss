const express = require('express');
const RssParser = require('rss-parser');
const router = new express.Router(); 
const { nSQL } = require("nano-sql"); 
const Acast  = require('../models/varvet/acastres');
const Utility = require('../utilities/utility');
const Constants = require('../utilities/constants');
 
const rssparser = new RssParser({
	 timeout: 30000,
});

 async function processRow(title,mp3Url) {
			let feed = await Utility.executor(title,mp3Url);		 
	 }

router.post('/rss', async (req, res) => {
	var acastArray = [];
	if(!req.body.url) {
		return res.status(400).send({"message": "url not provided"})
	}//https://rss.acast.com/varvet

	try {
		
  		let feed = await rssparser.parseURL(req.body.url);
 		if(!feed) {
 			return res.status(200).send({"message": Constants.NO_FEED_FOUND});
		 }
		 if(!feed.items || feed.items.length < 1) {
			return res.status(200).send({ "message": Constants.NO_FEED_FOUND});
		 }
		 
	for(var i=0; i<feed.items.length; i++) {
		let entry = feed.items[i];
	 
		let key = entry.title+entry.enclosure.url;

	 let episode =	await nSQL().query('select').where(['key', '=',key],['status','=', true]).exec();
			 let acast = new Acast();

	 		if(episode.length<1){

				acast.title =entry.title;
				acast.checksum = Constants.PROCESSING;
				acast.url = entry.enclosure.url;	
				//logic to change checksum to retry
				//processRow(entry.title,entry.enclosure.url); 
				acastArray.push(acast);
			}else {		
				acast.title =episode[0].title;
				acast.checksum = episode[0].checksum;
				acast.url = episode[0].url;
				acastArray.push(acast);
			}
	}
		res.status(200).send(acastArray);		

	} catch (e) {
		console.log(e)
		res.status(400).send({"error": e.toString()});
	}

});

module.exports = router;