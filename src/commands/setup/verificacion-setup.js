const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Ruta al archivo de configuración
const configPath = path.join(__dirname, '..\..\config\config.json');

// Función para leer la configuración
function readConfig() {
    try {
        const rawData = fs.readFileSync(configPath);
        return JSON.parse(rawData);
    } catch (error) {
        console.error("Error al leer config.json:", error);
        return {}; // Devuelve un objeto vacío si hay un error
    }
}

// Función para escribir la configuración
function writeConfig(config) {
    try {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    } catch (error) {
        console.error("Error al escribir en config.json:", error);
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verificacion-setup')
        .setDescription('Configura el sistema de verificación del bot.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // Solo admins
        .addSubcommand(subcommand =>
            subcommand
                .setName('canal-verificacion')
                .setDescription('Establece el canal donde se enviará el mensaje de verificación.')
                .addChannelOption(option =>
                    option.setName('canal')
                        .setDescription('El canal de texto para la verificación.')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('rol-verificado')
                .setDescription('Establece el rol que se asignará a los usuarios verificados.')
                .addRoleOption(option =>
                    option.setName('rol')
                        .setDescription('El rol para miembros verificados.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('canal-bienvenida')
                .setDescription('Establece el canal para los mensajes de bienvenida después de la verificación.')
                .addChannelOption(option =>
                    option.setName('canal')
                        .setDescription('El canal de texto para las bienvenidas.')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('canal-logs')
                .setDescription('Establece el canal para registrar quién se verifica.')
                .addChannelOption(option =>
                    option.setName('canal')
                        .setDescription('El canal de texto para los logs.')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true))),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const config = readConfig();

        config.guildId = interaction.guild.id; // Guardar siempre el ID del servidor

        let responseMessage = '';

        if (subcommand === 'canal-verificacion') {
            const channel = interaction.options.getChannel('canal');
            config.verificationChannelId = channel.id;
            responseMessage = `✅ El canal de verificación se ha establecido en ${channel}.`;
        } else if (subcommand === 'rol-verificado') {
            const role = interaction.options.getRole('rol');
            config.verifiedRoleId = role.id;
            responseMessage = `✅ El rol de verificado se ha establecido en ${role}.`;
        } else if (subcommand === 'canal-bienvenida') {
            const channel = interaction.options.getChannel('canal');
            config.welcomeChannelId = channel.id;
            responseMessage = `✅ El canal de bienvenida se ha establecido en ${channel}.`;
        } else if (subcommand === 'canal-logs') {
            const channel = interaction.options.getChannel('canal');
            config.logChannelId = channel.id;
            responseMessage = `✅ El canal de logs se ha establecido en ${channel}.`;
        }

        writeConfig(config);

        await interaction.reply({ content: responseMessage, ephemeral: true });
    },
};
