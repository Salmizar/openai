const express = require('express');
const router = express.Router();
/*const {Configuration, OpenAIApi} = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);*/
router.get('/', (req,res) => {
    console.log('called');
    try {
        const files = [
            {"name":"file1.pdf", "fileName":"file1.pdf.d23kcslkcjk2kdsj"},
            {"name":"4hours.pdf", "fileName":"4hours.pdf.fj33cksdcn2ncdd"},
            {"name":"openai.pdf", "fileName":"file1.pdf.d293k23s;l23sk3d"},
            {"name":"financials.pdf", "fileName":"file1.pdf.2dj2nfernvfvmnsd"},
            {"name":"salesforce.pdf", "fileName":"file1.pdf.2323ekjwlkwejcdw"}
        ];
        console.log('trying');
        res.status(200).json(files);
    } catch (error) {
        console.log('error ocurred');
        res.status(400).json({
            success: false,
            error: error.response ? error.response.data : "There was an issue on the server"
        })

    }

})
module.exports = router;