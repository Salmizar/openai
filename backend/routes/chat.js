const express = require('express');
const router = express.Router();
const {Configuration, OpenAIApi} = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const model = "gpt-3.5-turbo";
const temperature  = 0.8;

router.post('/', async (req,res) => {
    try {
        const response = await openai.createChatCompletion({
            //https://platform.openai.com/docs/models
            "model": model,
            //"messages": [{"role": "user", "content": req.body.message}],
            "messages": [JSON.parse(req.body.message)],
            "temperature": temperature
        })
        return res.status(200).json({
            success: true,
            usage: response.data.usage,
            data: response.data.choices[0].message
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.response ? error.response.data : "There was an issue on the server"
        })

    }

})
module.exports = router;