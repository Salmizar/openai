const express = require('express');
const router = express.Router();
const { chatGPT } = require("../modules/chatGPT.js");
const { searchDocument } = require('../modules/searchDocument.js');
const numberOfKeywordsToFind = 10;

router.post('/', async (req, res) => {
    let question = JSON.parse(req.body.message).content;
    let message = {
        "role": "user",
        content: `provide ${numberOfKeywordsToFind} keywords, in a comma delimited list, that I can use to search, based on question. only one word per keyword. just the words.
            '`+ question + `'`
    }
    //Ask ChatGPT to give up some keywords from the initial question
    chatGPT(message).then((data) => {
        let keywords = data.data.content.replace(/,/g, '').replace(/ /g, ', ').toLowerCase();
        //Find where those keywords are within the document and send just that part for ChatGPT to return the answer.
        searchDocument(JSON.parse(req.body.message).document, keywords).then((searchResults) => {
            let message = {
                "role": "user",
                content: `"${searchResults.text}"
                
                Baed on the above information, what is the answer to this question?
                
                '${question}'
                `
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
        }).catch((error) => {
            res.status(400).json({
                success: false,
                error: error.response ? error.response.data : "There was an issue on the server"
            })
        });
    }).catch((error) => {
        res.status(400).json({
            success: false,
            error: error.response ? error.response.data : "There was an issue on the server"
        })
    });
})
module.exports = router;