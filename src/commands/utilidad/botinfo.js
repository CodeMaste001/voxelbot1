const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Información del bot (versión, creador, uptime).'),
    async execute(interaction) {
        console.log(`Comando /botinfo ejecutado por ${interaction.user.tag}`);
        const uptime = process.uptime();
        const days = Math.floor(uptime / (3600 * 24));
        const hours = Math.floor((uptime % (3600 * 24)) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const botInfoEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Información del Bot')
            .addFields(
                { name: 'Versión', value: '1.0.0', inline: true }, // Placeholder, ideally read from package.json
                { name: 'Creador', value: 'Tu Nombre', inline: true }, // Placeholder
                { name: 'Uptime', value: `${days}d ${hours}h ${minutes}m ${seconds}s`, inline: false },
                { name: 'Memoria Usada', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
                { name: 'Sistema Operativo', value: `${os.platform()} ${os.arch()}`, inline: true },
                { name: 'Librería', value: 'discord.js', inline: true },
                { name: 'Servidores', value: interaction.client.guilds.cache.size.toString(), inline: true },
                { name: 'Usuarios', value: interaction.client.users.cache.size.toString(), inline: true },
            )
            .setTimestamp()
            .setFooter({ text: `Solicitado por ${interaction.user.tag}` });

        await interaction.reply({ embeds: [botInfoEmbed] });
    },
};