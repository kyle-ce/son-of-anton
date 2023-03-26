require("dotenv").config({ path: "../../.env" });
const { getImage } = require("./api/openai");
const { EmbedBuilder } = require("discord.js");

const { SlashCommandBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("dalle")
    .setDescription("Generate images from text prompts")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setRequired(true)
        .setDescription(
          "Text prompt for user to describe what image they want Dalle to generate"
        )
    )
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("Specify Art Style")
        .addChoices(
          { name: "Digital Art", value: "Digital Art" },
          { name: "8k resolution", value: "8k resolution" },
          { name: "Cyber Punk", value: "Cyber Punk" }
        )
    ),
  async execute(interaction) {
    const prompt = interaction.options.getString("prompt");
    const category = interaction.options.getString("category");
    const promptOptions = category ? { prompt, category } : { prompt };

    await interaction.deferReply();
    const response = await getImage(promptOptions);
    const image_url = response.data.data[0].url;
    console.log(`{ user : ${interaction.user.username}}`);
    console.log(`{ prompt : ${prompt} }`);
    category && console.log(`{ category : ${category} }`);
    // console.log(`{ image_url : ${image_url} }`);
    const imgEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .addFields({ name: "Prompt", value: prompt });
    if (category) {
      imgEmbed.addFields({ name: "Art Category", value: category });
    }
    imgEmbed.setImage(image_url);
    imgEmbed.setTimestamp();
    imgEmbed.setFooter({
      text: "Beta",
    });

    await interaction.editReply({
      //   content: prompt,
      embeds: [imgEmbed],
    });
  },
};
