const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config({ path: "../../.env" });
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const getChat = async (prompt) => {
  return (createChat = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  }));
};

const getImage = async (prompt) => {
  return (dalle = await openai.createImage({
    prompt: JSON.stringify(prompt),
    n: 1,
    size: "512x512",
  }));
};
module.exports = {
  getChat,
  getImage,
};
