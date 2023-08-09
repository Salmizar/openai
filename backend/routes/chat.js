const express = require('express');
const router = express.Router();
const { chatGPT } = require("../modules/chatGPT.js");
router.post('/', async (req, res) => {
    chatGPT(JSON.parse(req.body.message)).then((data) => {
        res.status(200).json(data);
    })
        .catch((error) => {
            res.status(400).json({
                success: false,
                error: error.response ? error.response.data : "There was an issue on the server"
            })
        });
})
module.exports = router;