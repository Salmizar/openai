const express = require("express");
require('dotenv').config();
const {Configuration, OpenAIApi} = require("openai");

const app = express();
const cors = require('cors');
app.use(cors({ origin: process.env.ORIGIN_URL.split(','), credentials: true }));
app.use(express.json());
//API calls

app.post('/chat', async (req,res) => {
    try {
        const response = await openai.createChatCompletion({
            //https://platform.openai.com/docs/models
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": req.body.message}],
            "temperature": 0
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

const port = process.env.PORT || 5000;
app.listen(port, () => {console.log('app listening on port',port);});
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
