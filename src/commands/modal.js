const {
  ActionRowBuilder,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

const { SlashCommandBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder().setName("modal").setDescription("Test Modal"),
  async execute(interaction) {
    /////////////////////////////////////////////////////
    // Create the modal
    const modal = new ModalBuilder()
      .setCustomId("writing-prompt")
      .setTitle("Prompt");

    // Add components to modal

    // Create the text input components
    const shortInput = new TextInputBuilder()
      .setCustomId("short")
      // The label is the prompt the user sees for this input
      .setLabel("Test Short")
      // Short means only a single line of text
      .setStyle(TextInputStyle.Short);

    const paragraphInput = new TextInputBuilder()
      .setCustomId("paragraph")
      .setLabel("Test Paragraph")
      // Paragraph means multiple lines of text.
      .setStyle(TextInputStyle.Paragraph);

    // An action row only holds one text input,
    // so you need one action row per text input.
    const firstActionRow = new ActionRowBuilder().addComponents(shortInput);
    const secondActionRow = new ActionRowBuilder().addComponents(
      paragraphInput
    );

    // Add inputs to the modal
    modal.addComponents(firstActionRow, secondActionRow);

    // Show the modal to the user
    await interaction.showModal(modal);
    /////////////////////////////////////////////////////
  },
};
