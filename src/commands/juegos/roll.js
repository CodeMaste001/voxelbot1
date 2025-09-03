const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Lanza un dado de 1 a n.')
        .addIntegerOption(option =>
            option.setName('numero')
                .setDescription('El número máximo del dado.')
                .setRequired(true)),
    async execute(interaction) {
        console.log(`Comando /roll ejecutado por ${interaction.user.tag}`);
        const max = interaction.options.getInteger('numero');
        if (max <= 0) {
            return interaction.reply('El número debe ser mayor que 0.');
        }
        const result = Math.floor(Math.random() * max) + 1;
        await interaction.reply(`Has sacado un ${result}.`);
    },
};