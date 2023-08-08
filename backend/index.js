const express = require("express");
require('dotenv').config();
const app = express();
const cors = require('cors');
app.use(cors({ origin: process.env.ORIGIN_URL.split(','), credentials: true }));
app.use(express.json());
//API calls
app.use('/chat', require('./routes/chat'));
app.use('/filechat', require('./routes/fileChat'));
app.use('/files', require('./routes/files'));

const port = process.env.PORT || 5000;
app.listen(port, () => { console.log('app listening on port', port); });


const { searchDocument } = require('./modules/searchDocument.js');

console.clear();
//searchDocument('Chris.DAoust.Resume.pdf.64ed47e559
//searchDocument('the-4-hour-workweek-expanded-and-updated-by-timothy-ferriss.pdf.1bca5549ac').then((pdfData) => {
//searchDocument('Chris.DAoust.Resume.pdf.64ed47e559').then((pdfData) => {
searchDocument('helloworld.pdf.1').then((pdfData) => {
    console.log('searchDocumentResults', pdfData);
}).catch((error) => {
    console.log('error', error);
});