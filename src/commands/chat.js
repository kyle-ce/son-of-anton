require("dotenv").config({ path: "../../.env" });
const { getChat } = require("./api/openai");
const { EmbedBuilder } = require("discord.js");

const { SlashCommandBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("chat")
    .setDescription("A all knowing companion")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setRequired(true)
        .setDescription("Ask me anything.")
    ),
  async execute(interaction) {
    const prompt = interaction.options.getString("prompt");
    await interaction.deferReply();
    const completion = await getChat(prompt);
    const response = completion.data.choices[0].message.content.toString();
    console.log(`{ prompt : ${prompt} }`);
    console.log(`{ response : ${response} }`);
    // // inside a command, event listener, etc.
    const chatEmbed = new EmbedBuilder()
      .setColor(0x4b0082)
      .setTitle(prompt)
      .setDescription(response)
      .setTimestamp()
      .setFooter({
        text: "Beta",
      });
    await interaction.editReply({
      //   content: prompt,
      embeds: [chatEmbed],
    });
  },
};
