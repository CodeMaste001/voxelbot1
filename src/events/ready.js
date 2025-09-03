const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        client.user.setActivity('Sonik: canción desconocida', { type: 'LISTENING' });
        console.log(`${client.user.tag} está conectado y escuchando Sonik.`);
    },
};