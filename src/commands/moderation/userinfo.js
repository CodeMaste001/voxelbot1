const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Información básica de un usuario.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario del que quieres información.')
                .setRequired(false)), // Not required, defaults to interaction.user
    async execute(interaction) {
        console.log(`Comando /userinfo ejecutado por ${interaction.user.tag}`);
        const user = interaction.options.getUser('usuario') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        const userInfoEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`Información de ${user.tag}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'ID de Usuario', value: user.id, inline: true },
                { name: 'Apodo', value: member ? member.nickname || 'Ninguno' : 'N/A', inline: true },
                { name: 'Se unió a Discord', value: user.createdAt.toDateString(), inline: true },
                { name: 'Se unió al servidor', value: member ? member.joinedAt.toDateString() : 'N/A', inline: true },
                { name: 'Roles', value: member ? member.roles.cache.map(role => role.name).join(', ') : 'N/A' },
            )
            .setTimestamp()
            .setFooter({ text: `Solicitado por ${interaction.user.tag}` });

        await interaction.reply({ embeds: [userInfoEmbed] });
    },
};