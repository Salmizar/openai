const express = require('express');
const router = express.Router();
const fs = require('fs');
const crypto = require('crypto');
const savedFilesFolder = './savedFiles/';
router.get('/', (req, res) => {
    try {
        var fileNames = [];
        fs.readdir(savedFilesFolder, (err, files) => {
            files.forEach(file => {
                fileNames.push({
                "name": file.substring(0,file.indexOf('.',file.indexOf('.')+1)),
                "fileName": file
            });
            });
            res.status(200).json(fileNames);
        });
    } catch (error) {
        console.log('error ocurred');
        res.status(400).json({
            success: false,
            error: error.response ? error.response.data : "There was an issue on the server"
        })
    }
})
router.post('/', function (request, response) {
    try {
        var body = '';
        filePath = savedFilesFolder+request.query.fileName+'.'+crypto.randomBytes(5).toString('hex');
        request.on('data', function(data) {
            body += data;
        });
        request.on('end', function (){
            fs.appendFile(filePath, body, function() {
                response.end();
            });
        });
    } catch (error) {
        response.status(400).json({
            success: false,
            error: error.response ? error.response.data : "There was an issue on the server"
        })
    }
});
router.delete('/', function (request, response) {
    console.log('delete', request.query.fileName);
    fs.unlinkSync(savedFilesFolder+request.query.fileName);
    response.status(200).send();
});
module.exports = router;