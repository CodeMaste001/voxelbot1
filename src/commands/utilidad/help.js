const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lista todos los comandos disponibles.'),
    async execute(interaction) {
        const commands = interaction.client.commands; // This is a Collection of commands

        const helpEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Comandos Disponibles')
            .setDescription('Aquí tienes una lista de todos mis comandos:');

        // Group commands by category (assuming categories are based on directory names)
        const categories = {};
        for (const [name, command] of commands) {
            // This is a bit tricky as the command object doesn't directly store its category.
            // For now, I'll just list them all. A more robust solution would involve
            // adding a 'category' property to each command's module.exports.
            // For simplicity, I'll just list them alphabetically for now.
            helpEmbed.addFields({ name: `/${command.data.name}`, value: command.data.description || 'Sin descripción.', inline: false });
        }

        await interaction.reply({ embeds: [helpEmbed] });
    },
};