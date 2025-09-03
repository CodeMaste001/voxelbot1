const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulsa a un usuario del servidor.')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers) // Solo visible para quienes pueden expulsar
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario a expulsar.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('razon')
                .setDescription('La razón de la expulsión.')
                .setRequired(false)),

    async execute(interaction) {
        console.log(`Comando /kick ejecutado por ${interaction.user.tag}`);
        if (!interaction.member.roles.cache.some(r => r.name === 'Admin' || r.name === 'Moderador')) {
            return interaction.reply({ content: "No tienes permisos para usar este comando.", ephemeral: true });
        }
        const userToKick = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('razon') || 'No se especificó una razón.';
        const memberToKick = interaction.guild.members.cache.get(userToKick.id);

        if (!memberToKick) {
            return interaction.reply({ content: 'No se pudo encontrar al usuario en este servidor.', ephemeral: true });
        }

        if (!memberToKick.kickable) {
            return interaction.reply({ content: 'No puedo expulsar a este usuario. Puede que tenga un rol más alto que el mío.', ephemeral: true });
        }

        try {
            await memberToKick.kick(reason);

            const embed = new EmbedBuilder()
                .setColor(0xFFA500)
                .setTitle('Usuario Expulsado')
                .setDescription(`**${userToKick.tag}** ha sido expulsado del servidor.`)
                .addFields(
                    { name: 'Razón', value: reason },
                    { name: 'Moderador', value: interaction.user.tag }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error al intentar expulsar al usuario:', error);
            await interaction.reply({ content: 'Ocurrió un error al intentar expulsar al usuario.', ephemeral: true });
        }
    },
};
