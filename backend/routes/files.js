const express = require('express');
const router = express.Router();
const fs = require('fs');
const crypto = require('crypto');
const savedFilesFolder = process.env.SAVED_FILES_FOLDER;
router.get('/', (req, res) => {
    try {
        var fileNames = [];
        fs.readdir(savedFilesFolder, (err, files) => {
            files.forEach(file => {
                fileNames.push({
                "name": file.substring(0,file.lastIndexOf('.')),
                "fileName": file
            });
            });
            res.status(200).json(fileNames);
        });
    } catch (error) {
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
    fs.unlinkSync(savedFilesFolder+request.query.fileName);
    response.status(200).send();
});
module.exports = router;