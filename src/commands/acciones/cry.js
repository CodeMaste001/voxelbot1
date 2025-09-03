const { SlashCommandBuilder } = require('discord.js');
const { fetchGiphyGif } = require('../../utils/giphyFetcher');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cry')
        .setDescription('Envía un GIF de llanto.'),
    async execute(interaction) {
        console.log(`Comando /cry ejecutado por ${interaction.user.tag}`);
        await interaction.deferReply(); // Defer the reply immediately

        const searchQuery = 'anime crying'; // Updated search query
        const gifUrl = await fetchGiphyGif(searchQuery);

        if (gifUrl && !gifUrl.startsWith('Error')) { // Check if it's a valid URL and not an error message
            console.log(`GIF encontrado para "${searchQuery}": ${gifUrl}`);
            await interaction.editReply({ content: '¡A llorar!', files: [gifUrl] }); // Use editReply
        } else if (gifUrl && gifUrl.startsWith('Error')) { // If it's an error message
            console.error(`Error al buscar GIF para "${searchQuery}": ${gifUrl}`);
            await interaction.editReply({ content: gifUrl }); // Reply with the error message
        } else { // No GIF found
            console.log(`No se encontró GIF para "${searchQuery}".`);
            await interaction.editReply({ content: 'No se encontró GIF de anime, intenta de nuevo.' }); // Updated no GIF found message
        }
    },
};