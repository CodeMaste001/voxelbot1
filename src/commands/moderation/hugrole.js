const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hugrole')
        .setDescription('Envía un mensaje dirigido a todos los miembros de un rol.')
        .addRoleOption(option =>
            option.setName('rol')
                .setDescription('El rol al que enviar el mensaje.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('mensaje')
                .setDescription('El mensaje a enviar.')
                .setRequired(true)),
    async execute(interaction) {
        console.log(`Comando /hugrole ejecutado por ${interaction.user.tag}`);
        const role = interaction.options.getRole('rol');
        const message = interaction.options.getString('mensaje');

        await interaction.reply(`Mensaje para todos los miembros de ${role}: ${message}`);
    },
};