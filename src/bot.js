require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");

const { Client, Collection, GatewayIntentBits, Events } = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
  requestTimeout: 30000,
});
//commands
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
    console.log("command:", command.data.name);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.log("***************************");
    console.error(error?.message);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: error?.message,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content:
          "There was an error: is the bot in a perpetual deferred state?",
        ephemeral: true,
      });
    }
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;
  if (interaction.customId === "writing-prompt") {
    // Get the data entered by the user
    const short = interaction.fields.getTextInputValue("short");
    const paragraph = interaction.fields.getTextInputValue("paragraph");
    console.log({ short, paragraph });
    await interaction.reply({
      content: `Your submission was received successfully! \n {Header:${short}, Body:${paragraph}} `,
    });
  }
});
//client.channels.cache.get("782390882317762621").send("Hello here!");

client.login(process.env.BOT_TOKEN);
