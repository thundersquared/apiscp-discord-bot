const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rtfm')
        .setDescription('Performs a query on docs and notes returning closest matching result.')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The search query to look up')
                .setRequired(true)),
    async execute(interaction) {
        // If fts has been initialized
        if (interaction.bot.fts) {
            // Perform a search given the interaction query
            const query = interaction.options.getString('query');
            const results = interaction.bot.fts.search(query);

            if (results.length > 0) {
                // Return first entry, as result come sorted
                const result = results[0];

                let response = result.item.body;

                // Link to path instead of posting the content
                if (result.item.path) {
                    response = result.item.path;
                }

                return await interaction.reply(response);
            }
        }

        return await interaction.reply({
            content: 'No luck! Try another keyword.',
            ephemeral: true,
        });
    },
};
