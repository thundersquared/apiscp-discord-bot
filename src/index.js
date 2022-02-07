// Load .env
require('dotenv').config();

// Load packages
const Discord = require('discord.js');
const Bot = require('./Bot');

// Store all parsed queries for later use
const intents = new Bot.Intents();

// Set up bot
const bot = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
});

bot.on('ready', async () => {
    console.log(`Logged in as ${bot.user.tag}!`);
    intents.preload();
});

// Register message reaction handler
bot.on('messageReactionAdd', async (reaction, _) => {
    // If the reactiong is on a bot's message, delete it when receiving an ❌ reaction
    if (reaction.message.author.id === bot.user.id && reaction.emoji.name === '❌') reaction.message.delete();
});

// Register an event to handle incoming messages
bot.on('messageCreate', async message => {
    // This block will prevent the bot from responding to itself and other bots
    if (message.author.bot) return;

    // Don't listen to DMs
    if (!message.guild) return;

    // Transform to lowercase for easier matching
    const content = message.content.toLowerCase();

    // Show list of available commands
    if (message.mentions.users.size > 0 && message.mentions.users.values().next().value.id === bot.user.id && content.includes('!commands')) {
        return Bot.sendOrReply(bot, message, intents.intents.map(e => `- ${e.query}`).join("\n"));
    }

    // Check if content matches a query, and send the response
    intents.intents.forEach(e => {
        if (content.includes(e.query)) return Bot.sendOrReply(bot, message, e.response);
    });
});

bot.login(process.env.DISCORD_TOKEN);
