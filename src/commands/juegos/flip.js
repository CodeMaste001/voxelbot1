const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('flip')
        .setDescription('Lanza una moneda (cara o cruz).'),
    async execute(interaction) {
        console.log(`Comando /flip ejecutado por ${interaction.user.tag}`);
        const result = Math.random() < 0.5 ? 'Cara' : 'Cruz';
        await interaction.reply(`Ha salido ${result}.`);
    },
};