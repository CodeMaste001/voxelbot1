require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();

// Cargar comandos de forma recursiva
function loadCommands(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.lstatSync(fullPath);
        if (stat.isDirectory()) {
            loadCommands(fullPath);
        } else if (file.endsWith('.js')) {
            try {
                const command = require(fullPath);
                if (command.data && command.data.name) {
                    client.commands.set(command.data.name, command);
                    console.log(`Comando cargado: ${command.data.name}`);
                }
            } catch (error) {
                console.error(`Error al cargar el comando en ${fullPath}:`, error);
            }
        }
    }
}

// Cargar eventos
function loadEvents(dir) {
    const files = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
    for (const file of files) {
        try {
            const event = require(path.join(dir, file));
            if (event.name && typeof event.execute === 'function') {
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args, client));
                } else {
                    client.on(event.name, (...args) => event.execute(...args, client));
                }
                console.log(`Evento cargado: ${event.name}`);
            }
        } catch (error) {
            console.error(`Error al cargar el evento en ${file}:`, error);
        }
    }
}

loadCommands(path.join(__dirname, 'src', 'commands'));
loadEvents(path.join(__dirname, 'src', 'events'));

const ownerId = '1212135719523328011';

async function sendErrorToOwner(error) {
  try {
    const owner = await client.users.fetch(ownerId);
    if (owner) {
      await owner.send(`:warning: Se produjo un error en el bot:\n\`\`\`${error.stack || error}\`\`\``);
    }
  } catch (err) {
    console.error('No se pudo enviar el error al propietario:', err);
  }
}

process.on('unhandledRejection', error => {
  console.error('Unhandled Rejection:', error);
  sendErrorToOwner(error);
});

process.on('uncaughtException', error => {
  console.error('Uncaught Exception:', error);
  sendErrorToOwner(error);
});

client.login(process.env.DISCORD_TOKEN);
