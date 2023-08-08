const express = require('express');
const router = express.Router();
const { chatGPT } = require("../modules/chatGPT.js");
const numberOfKeywordsToFind = 5;

router.post('/', async (req, res) => {
    let message = {
        "role": "user",
        content: `provide ${numberOfKeywordsToFind} words, comma delimited list, used to search, based on this. Just the words.

            '`+ JSON.parse(req.body.message).content+`'`
    }
    chatGPT(message).then((data) => {



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