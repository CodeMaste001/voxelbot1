const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Banea a un usuario del servidor.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) // Solo visible para quienes pueden banear
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario a banear.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('razon')
                .setDescription('La razón del baneo.')
                .setRequired(false)),

    async execute(interaction) {
        console.log(`Comando /ban ejecutado por ${interaction.user.tag}`);
        if (!interaction.member.roles.cache.some(r => r.name === 'Admin' || r.name === 'Moderador')) {
            return interaction.reply({ content: "No tienes permisos para usar este comando.", ephemeral: true });
        }
        const userToBan = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('razon') || 'No se especificó una razón.';
        const memberToBan = interaction.guild.members.cache.get(userToBan.id);

        if (!memberToBan) {
            return interaction.reply({ content: 'No se pudo encontrar al usuario en este servidor.', ephemeral: true });
        }

        if (!memberToBan.bannable) {
            return interaction.reply({ content: 'No puedo banear a este usuario. Puede que tenga un rol más alto que el mío.', ephemeral: true });
        }

        try {
            await memberToBan.ban({ reason: reason });

            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Usuario Baneado')
                .setDescription(`**${userToBan.tag}** ha sido baneado del servidor.`)
                .addFields(
                    { name: 'Razón', value: reason },
                    { name: 'Moderador', value: interaction.user.tag }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error al intentar banear al usuario:', error);
            await interaction.reply({ content: 'Ocurrió un error al intentar banear al usuario.', ephemeral: true });
        }
    },
};
