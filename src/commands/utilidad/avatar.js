const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Muestra el avatar de un usuario.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario del que quieres ver el avatar.')
                .setRequired(false)), // Not required, defaults to interaction.user
    async execute(interaction) {
        console.log(`Comando /avatar ejecutado por ${interaction.user.tag}`);
        const user = interaction.options.getUser('usuario') || interaction.user;
        const avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 });

        const avatarEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`Avatar de ${user.tag}`)
            .setImage(avatarURL)
            .setTimestamp()
            .setFooter({ text: `Solicitado por ${interaction.user.tag}` });

        await interaction.reply({ embeds: [avatarEmbed] });
    },
};