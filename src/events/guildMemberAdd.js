const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config/config.json');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        // Ignorar bots
        if (member.user.bot) return;

        const verificationChannel = member.guild.channels.cache.get(config.verificationChannelId);
        if (!verificationChannel) {
            console.error(`Error: El canal de verificación con ID ${config.verificationChannelId} no fue encontrado.`);
            return;
        }

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('¡Bienvenido/a al Servidor!')
            .setDescription(`¡Hola ${member.user.username}! Para acceder a todos los canales y funcionalidades del servidor, por favor, verifica tu cuenta haciendo clic en el botón de abajo.`)
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp();

        const verifyButton = new ButtonBuilder()
            .setCustomId('verify_user')
            .setLabel('Verificar')
            .setStyle(ButtonStyle.Success)
            .setEmoji('✅');

        const row = new ActionRowBuilder().addComponents(verifyButton);

        try {
            await verificationChannel.send({
                content: `${member.user}`, // Ping al usuario
                embeds: [embed],
                components: [row]
            });
        } catch (error) {
            console.error(`No se pudo enviar el mensaje de verificación al canal ${config.verificationChannelId}:`, error);
        }
    },
};