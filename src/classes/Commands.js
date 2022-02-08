const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const {
    DISCORD_TOKEN,
    DISCORD_GUILD,
    DISCORD_CLIENT_ID,
} = process.env;

class Commands {
    constructor(client) {
        this.client = client;
        this.rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);
        this.commands = [];

        const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            this.commands.push(command);
        }
    }

    get definitions() {
        return this.commands.map(command => command.data.toJSON());
    }

    find(commandName) {
        return this.commands.find(command => command.data.name === commandName);
    }

    async refresh() {
        try {
            console.log('Started refreshing application (/) commands.');

            await this.rest.put(
                Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD),
                { body: this.definitions },
            );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = Commands;
