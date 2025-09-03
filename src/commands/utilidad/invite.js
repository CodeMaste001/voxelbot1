const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Genera un link para invitar al bot.'),
    async execute(interaction) {
        console.log(`Comando /invite ejecutado por ${interaction.user.tag}`);
        // Replace YOUR_CLIENT_ID with the actual client ID of your bot
        // You can find this in the Discord Developer Portal under your application's General Information
        const clientId = interaction.client.user.id;
        const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands`;
        await interaction.reply(`Puedes invitarme a tu servidor usando este enlace: ${inviteLink}`);
    },
};