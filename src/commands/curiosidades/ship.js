const { SlashCommandBuilder } = require('discord.js');
const { fetchGiphyGif } = require('../../utils/giphyFetcher');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription('Envía un GIF de "shipping" entre dos usuarios.')
        .addUserOption(option =>
            option.setName('usuario1')
                .setDescription('El primer usuario.')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('usuario2')
                .setDescription('El segundo usuario.')
                .setRequired(true)),
    async execute(interaction) {
        console.log(`Comando /ship ejecutado por ${interaction.user.tag}`);
        await interaction.deferReply(); // Defer the reply immediately

        const user1 = interaction.options.getUser('usuario1');
        const user2 = interaction.options.getUser('usuario2');
        const searchQuery = 'anime ship';
        const gifUrl = await fetchGiphyGif(searchQuery);

        if (gifUrl && !gifUrl.startsWith('Error')) { // Check if it's a valid URL and not an error message
            console.log(`GIF encontrado para "${searchQuery}": ${gifUrl}`);
            await interaction.editReply({ content: `¡${user1} y ${user2} hacen una linda pareja!`, files: [gifUrl] }); // Use editReply
        } else if (gifUrl && gifUrl.startsWith('Error')) { // If it's an error message
            console.error(`Error al buscar GIF para "${searchQuery}": ${gifUrl}`);
            await interaction.editReply({ content: gifUrl }); // Use editReply with the error message
        }
    },
};