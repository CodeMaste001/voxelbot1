const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Crea una encuesta con opciones.')
        .addStringOption(option =>
            option.setName('pregunta')
                .setDescription('La pregunta de la encuesta.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('opciones')
                .setDescription('Opciones separadas por |. Ejemplo: Op1 | Op2 | Op3')
                .setRequired(true)),
    async execute(interaction) {
        console.log(`Comando /poll ejecutado por ${interaction.user.tag}`);
        const question = interaction.options.getString('pregunta');
        const options = interaction.options.getString('opciones').split('|').map(opt => opt.trim());

        if (options.length < 2) {
            return interaction.reply('Necesitas al menos dos opciones para la encuesta.');
        }
        if (options.length > 10) {
            return interaction.reply('No puedes tener más de 10 opciones para la encuesta.');
        }

        const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

        const pollEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(question)
            .setDescription(options.map((opt, i) => `${emojis[i]} ${opt}`).join('\n'))
            .setTimestamp()
            .setFooter({ text: `Encuesta creada por ${interaction.user.tag}` });

        const reply = await interaction.reply({ embeds: [pollEmbed], fetchReply: true });

        for (let i = 0; i < options.length; i++) {
            await reply.react(emojis[i]);
        }
    },
};