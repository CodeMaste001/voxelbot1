const { SlashCommandBuilder } = require('discord.js');
const { fetchGiphyGif } = require('../../utils/giphyFetcher');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sleep')
        .setDescription('El bot duerme.'),
    async execute(interaction) {
        console.log(`Comando /sleep ejecutado por ${interaction.user.tag}`);
        await interaction.deferReply(); // Defer the reply immediately

        const searchQuery = 'anime sleep';
        const gifUrl = await fetchGiphyGif(searchQuery);

        if (gifUrl && !gifUrl.startsWith('Error')) { // Check if it's a valid URL and not an error message
            console.log(`GIF encontrado para "${searchQuery}": ${gifUrl}`);
            await interaction.editReply({ content: '¡A dormir!', files: [gifUrl] }); // Use editReply
        } else if (gifUrl && gifUrl.startsWith('Error')) { // If it's an error message
            console.error(`Error al buscar GIF para "${searchQuery}": ${gifUrl}`);
            await interaction.editReply({ content: gifUrl }); // Use editReply with the error message
        }
    },
};