const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Información básica del servidor.'),
    async execute(interaction) {
        console.log(`Comando /serverinfo ejecutado por ${interaction.user.tag}`);
        const { guild } = interaction;

        const serverInfoEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`Información del servidor: ${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                { name: 'ID del Servidor', value: guild.id, inline: true },
                { name: 'Propietario', value: `<@${guild.ownerId}>`, inline: true },
                { name: 'Miembros', value: guild.memberCount.toString(), inline: true },
                { name: 'Canales', value: guild.channels.cache.size.toString(), inline: true },
                { name: 'Roles', value: guild.roles.cache.size.toString(), inline: true },
                { name: 'Fecha de Creación', value: guild.createdAt.toDateString(), inline: true },
            )
            .setTimestamp()
            .setFooter({ text: `Solicitado por ${interaction.user.tag}` });

        await interaction.reply({ embeds: [serverInfoEmbed] });
    },
};