require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'src', 'commands');

// Función para cargar comandos de forma recursiva
function loadCommands(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.lstatSync(fullPath);
        if (stat.isDirectory()) {
            loadCommands(fullPath); // Recursivo
        } else if (file.endsWith('.js')) {
            try {
                const command = require(fullPath);
                if (command.data && command.data.name) {
                    commands.push(command.data.toJSON());
                }
            } catch (error) {
                console.error(`Error al cargar el comando en ${fullPath}:`, error);
            }
        }
    }
}

loadCommands(commandsPath);

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(`Registrando ${commands.length} comandos slash...`);

    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );

    console.log(`Se registraron ${data.length} comandos correctamente.`);
  } catch (error) {
    console.error(error);
  }
})();