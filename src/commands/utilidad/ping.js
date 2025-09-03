const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Muestra la latencia del bot.'),
    async execute(interaction) {
        console.log(`Comando /ping ejecutado por ${interaction.user.tag}`);
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        await interaction.editReply(`Pong! Latencia: ${latency}ms. Latencia de la API: ${interaction.client.ws.ping}ms.`);
    },
};