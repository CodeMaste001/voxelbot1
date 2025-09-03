const { Events, ActivityType } = require('discord.js');
const { startAuthServer } = require('../../spotify-auth.js');
const { getTokens, getCurrentlyPlaying } = require('../../spotify-service.js');

let lastTrackId = null;

async function updateSpotifyPresence(client) {
    try {
        const songData = await getCurrentlyPlaying();

        if (songData && songData.is_playing) {
            const track = songData.item;
            if (track.id === lastTrackId) return; // Don't update if the song is the same

            lastTrackId = track.id;
            const artist = track.artists.map(a => a.name).join(', ');
            const title = track.name;

            client.user.setActivity(`Sonik: ${title} - ${artist}`.substring(0, 128), {
                type: ActivityType.Listening
            });

        } else {
            if (lastTrackId === null) return; // Already cleared

            lastTrackId = null;
            client.user.setActivity(null);
        }
    } catch (error) {
        client.user.setActivity(null); // Clear presence on error
        lastTrackId = null;
    }
}

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        

        // --- INTEGRACIÓN CON SPOTIFY ---
        const tokens = await getTokens();

        if (!tokens) {
            // Si no hay tokens, iniciar el servidor de autenticación
            startAuthServer();
        } else {
            // Si hay tokens, empezar a monitorear
            updateSpotifyPresence(client); // Update immediately on start
            setInterval(() => updateSpotifyPresence(client), 15 * 1000); // Y luego cada 15 segundos
        }
    },
};