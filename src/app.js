const express = require('express');
const rss = require('./routers/rss');
 
const app = express();

// const {
//   Worker, isMainThread, parentPort, workerData
// } = require('worker_threads');

const { nSQL } = require("nano-sql");
const { nSQLiteAdapter, sqlite3 } = require("nano-sqlite");
 
nSQL("rss") 
.model([
  { key: 'key', type: 'string', props: ["pk"]},
  { key: 'title', type: 'string' },
  { key: 'checksum', type: 'string' },
  { key: 'status', type: 'boolean' }
  
])
.config({
    mode: new nSQLiteAdapter(":memory:", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE),
}).connect()


app.use(express.json());
app.use(rss);




// function runService(workerData) {
//   return new Promise((resolve, reject) => {
//     const backgroundWorker = new Worker('./src/services/background.js', { workerData });

//     backgroundWorker.on('message', resolve);
//     backgroundWorker.on('error', reject);
//     backgroundWorker.on('exit', (code) => {
//       if (code !== 0)
//         reject(new Error(`Worker stopped with exit code ${code}`));
//     })

//     rssWorker.on('message', resolve);
//     rssWorker.on('error', reject);
//     rssWorker.on('exit', (code) => {
//       if (code !== 0)
//         reject(new Error(`Worker stopped with exit code ${code}`));
//     })
//   })
// }

// async function run() {
//   const result = await runService('world')
//   console.log(result);
// }

// run().catch(err => console.error(err))


module.exports = app;