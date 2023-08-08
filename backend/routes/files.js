const express = require('express');
const router = express.Router();
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const savedFilesFolder = process.env.SAVED_FILES_FOLDER;
const storage = multer.diskStorage({   
    destination: function(req, file, cb) { 
       cb(null, savedFilesFolder);
    }, 
    filename: function (req, file, cb) { 
       cb(null , file.originalname+'.'+crypto.randomBytes(5).toString('hex'));
    }
 });
const upload = multer({ storage: storage });
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
router.post('/', upload.single("file"), function (request, response) {
    response.status(200).send();
});
router.delete('/', function (request, response) {
    fs.unlinkSync(savedFilesFolder+request.query.fileName);
    response.status(200).send();
});
module.exports = router;