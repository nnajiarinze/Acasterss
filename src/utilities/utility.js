const Path = require('path'); 
const fs = require('fs') ; 
const Axios = require('axios');
const { nSQL } = require("nano-sql"); 
var checksum = require('checksum');
const Constants = require('../utilities/constants');

module.exports = {
    generateFileName: function (length) {
        var result  = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     },
     downloadImage : async function  (mp3Url, fileName) {  
        const url = mp3Url;
        const path = Path.resolve(__dirname, 'mp3', fileName+'.mp3');
        const writer = fs.createWriteStream(path)
      
        const response = await Axios({
          url,
          method: 'GET',
          responseType: 'stream'
        }) 
      
        response.data.pipe(writer) 
       
        return new Promise((resolve, reject) => {
          writer.on('finish', resolve)
          writer.on('error', reject)
        })
      },
      executor : function executor(title,mp3Url) {
          return new Promise(resolve => {
 
           const fileName = this.generateFileName(7);
           let filePromise =  this.downloadImage(mp3Url,fileName);
           filePromise.then(() => {
 
           const filePath = __dirname + '/mp3/' + fileName+'.mp3';
           checksum.file(filePath, function (err, sum) {
               if(err) {
                   console.log(err);
               }
                  nSQL(Constants.RSS).query('upsert', { // Add a record
                      key: title+mp3Url,
                      title: title,
              checksum:sum,
              status: true
              }).exec();
              fs.unlinkSync(filePath)
           
       })
           })	
           .catch((err) => {      
               nSQL(Constants.RSS).query('upsert', { // Add a record
                  key: title+mp3Url,
                  title: title,
                  checksum: mp3Url,
                  status: false
              }).exec()
           })
      
      
          });
        }
  };