const { SlashCommandBuilder } = require('discord.js');
const { fetchGiphyGif } = require('../../utils/giphyFetcher');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Envía un GIF de abrazo y menciona al usuario.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario a abrazar.')
                .setRequired(true)),
    async execute(interaction) {
        console.log(`Comando /hug ejecutado por ${interaction.user.tag}`);
        await interaction.deferReply(); // Defer the reply immediately

        const user = interaction.options.getUser('usuario');
        const searchQuery = 'anime hug';
        const gifUrl = await fetchGiphyGif(searchQuery);

        if (gifUrl && !gifUrl.startsWith('Error')) { // Check if it's a valid URL and not an error message
            console.log(`GIF encontrado para "${searchQuery}": ${gifUrl}`);
            await interaction.editReply({ content: `¡${interaction.user} le ha dado un abrazo a ${user}!`, files: [gifUrl] }); // Use editReply
        } else if (gifUrl && gifUrl.startsWith('Error')) { // If it's an error message
            console.error(`Error al buscar GIF para "${searchQuery}": ${gifUrl}`);
            await interaction.editReply({ content: gifUrl }); // Use editReply with the error message
        }
    },
};