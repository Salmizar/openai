
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.chatGPT = (message) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await openai.createChatCompletion({
                //https://platform.openai.com/docs/models
                "model": process.env.OPENAI_MODEL,
                //"messages": [{"role": "user", "content": req.body.message}],
                "messages": [message],
                "temperature": process.env.OPENAI_TEMPERATURE
            })
            resolve({
                success: true,
                usage: response.data.usage,
                data: response.data.choices[0].message
            });
        } catch (error) {
            reject({
                success: false,
                error: error.response ? error.response.data : "There was an issue on the server"
            });
        }
    });
}