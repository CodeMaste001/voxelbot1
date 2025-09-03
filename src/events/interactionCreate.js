const { Events, EmbedBuilder } = require('discord.js');
const config = require('../config/config.json');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) { // Se añade "client" para acceder a los comandos
        
        // Manejador de Slash Commands
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No se encontró ningún comando que coincida con ${interaction.commandName}.`);
                await interaction.reply({ content: 'Hubo un error al ejecutar este comando.', ephemeral: true });
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error al ejecutar el comando ${interaction.commandName}:`, error);
                await interaction.reply({ content: 'Hubo un error al ejecutar este comando.', ephemeral: true });
            }
        }
        
        // Manejador de Botones
        else if (interaction.isButton()) {
            if (interaction.customId === 'verify_user') {
                const member = interaction.member;

                const verifiedRole = interaction.guild.roles.cache.get(config.verifiedRoleId);
                if (!verifiedRole) {
                    console.error(`Error: El rol verificado con ID ${config.verifiedRoleId} no fue encontrado.`);
                    await interaction.reply({ content: 'Ocurrió un error con la configuración del bot. Por favor, contacta a un administrador.', ephemeral: true });
                    return;
                }

                try {
                    await member.roles.add(verifiedRole);
                } catch (error) {
                    console.error(`No se pudo asignar el rol verificado a ${member.user.tag}:`, error);
                    await interaction.reply({ content: 'Ocurrió un error al asignarte el rol. Por favor, contacta a un administrador.', ephemeral: true });
                    return;
                }

                await interaction.reply({ content: '¡Has sido verificado/a exitosamente! Ahora tienes acceso al resto del servidor.', ephemeral: true });

                const welcomeChannel = interaction.guild.channels.cache.get(config.welcomeChannelId);
                if (welcomeChannel) {
                    const welcomeEmbed = new EmbedBuilder()
                        .setColor(0x00FF00)
                        .setTitle(`¡Nuevo miembro verificado!`)
                        .setDescription(`¡Démosle la bienvenida a ${member.user} al servidor! Esperamos que disfrutes tu estadía.`)
                        .setThumbnail(member.user.displayAvatarURL());
                    try {
                        await welcomeChannel.send({ embeds: [welcomeEmbed] });
                    } catch (error) {
                        console.error(`No se pudo enviar el mensaje de bienvenida al canal ${config.welcomeChannelId}:`, error);
                    }
                }

                const logChannel = interaction.guild.channels.cache.get(config.logChannelId);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setColor(0xFFA500)
                        .setTitle('Usuario Verificado (Log)')
                        .addFields(
                            { name: 'Usuario', value: `${member.user.tag} (${member.id})` },
                            { name: 'Fecha', value: new Date().toLocaleString() }
                        )
                        .setThumbnail(member.user.displayAvatarURL());
                    try {
                        await logChannel.send({ embeds: [logEmbed] });
                    } catch (error) {
                        console.error(`No se pudo enviar el log de verificación al canal ${config.logChannelId}:`, error);
                    }
                }
            }
        }
    },
};