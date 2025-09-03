const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

// Función para convertir tiempo (ej: 10m, 1h, 1d) a milisegundos
function ms(str) {
    const unit = str.slice(-1).toLowerCase();
    const value = parseInt(str.slice(0, -1));
    if (isNaN(value)) return null;

    switch (unit) {
        case 's': return value * 1000;
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'd': return value * 24 * 60 * 60 * 1000;
        default: return null;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Silencia a un usuario por un tiempo determinado (timeout).')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers) // Permiso para silenciar
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario a silenciar.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('duracion')
                .setDescription('La duración del silencio (ej: 10m, 1h, 7d).')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('razon')
                .setDescription('La razón del silencio.')
                .setRequired(false)),

    async execute(interaction) {
        console.log(`Comando /mute ejecutado por ${interaction.user.tag}`);
        if (!interaction.member.roles.cache.some(r => r.name === 'Admin' || r.name === 'Moderador')) {
            return interaction.reply({ content: "No tienes permisos para usar este comando.", ephemeral: true });
        }
        const userToMute = interaction.options.getUser('usuario');
        const durationStr = interaction.options.getString('duracion');
        const reason = interaction.options.getString('razon') || 'No se especificó una razón.';
        const memberToMute = interaction.guild.members.cache.get(userToMute.id);

        if (!memberToMute) {
            return interaction.reply({ content: 'No se pudo encontrar al usuario en este servidor.', ephemeral: true });
        }

        const durationMs = ms(durationStr);
        if (!durationMs) {
            return interaction.reply({ content: 'La duración no es válida. Usa un formato como: 10s, 5m, 2h, 3d.', ephemeral: true });
        }

        // No puedes silenciar a alguien por más de 28 días
        if (durationMs > 28 * 24 * 60 * 60 * 1000) {
            return interaction.reply({ content: 'No se puede silenciar a un usuario por más de 28 días.', ephemeral: true });
        }

        if (!memberToMute.moderatable) {
            return interaction.reply({ content: 'No puedo silenciar a este usuario. Puede que tenga un rol más alto que el mío.', ephemeral: true });
        }

        try {
            await memberToMute.timeout(durationMs, reason);

            const embed = new EmbedBuilder()
                .setColor(0x808080)
                .setTitle('Usuario Silenciado')
                .setDescription(`**${userToMute.tag}** ha sido silenciado.`)
                .addFields(
                    { name: 'Duración', value: durationStr },
                    { name: 'Razón', value: reason },
                    { name: 'Moderador', value: interaction.user.tag }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error al intentar silenciar al usuario:', error);
            await interaction.reply({ content: 'Ocurrió un error al intentar silenciar al usuario.', ephemeral: true });
        }
    },
};
