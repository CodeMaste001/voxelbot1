const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Juega piedra, papel o tijera.')
        .addStringOption(option =>
            option.setName('eleccion')
                .setDescription('Tu elección: piedra, papel o tijera.')
                .setRequired(true)
                .addChoices(
                    { name: 'Piedra', value: 'piedra' },
                    { name: 'Papel', value: 'papel' },
                    { name: 'Tijera', value: 'tijera' }
                )),
    async execute(interaction) {
        console.log(`Comando /rps ejecutado por ${interaction.user.tag}`);
        const userChoice = interaction.options.getString('eleccion');
        const choices = ['piedra', 'papel', 'tijera'];
        const botChoice = choices[Math.floor(Math.random() * choices.length)];

        let result;
        if (userChoice === botChoice) {
            result = 'Es un empate.';
        } else if (
            (userChoice === 'piedra' && botChoice === 'tijera') ||
            (userChoice === 'papel' && botChoice === 'piedra') ||
            (userChoice === 'tijera' && botChoice === 'papel')
        ) {
            result = 'Has ganado.';
        } else {
            result = 'Has perdido.';
        }

        await interaction.reply(`Tú elegiste ${userChoice}, el bot eligió ${botChoice}. ${result}`);
    },
};