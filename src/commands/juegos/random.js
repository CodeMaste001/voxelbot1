const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('Escoge un elemento aleatorio de una lista.')
        .addStringOption(option =>
            option.setName('lista')
                .setDescription('La lista de elementos separados por comas.')
                .setRequired(true)),
    async execute(interaction) {
        console.log(`Comando /random ejecutado por ${interaction.user.tag}`);
        const list = interaction.options.getString('lista').split(',');
        const randomItem = list[Math.floor(Math.random() * list.length)].trim();
        await interaction.reply(`El elemento aleatorio es: ${randomItem}`);
    },
};