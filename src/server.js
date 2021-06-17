require('dotenv').config();
const fs = require('fs');
const Discord = require("discord.js");

const client = new Discord.Client();
client.commands = new Discord.Collection();
const prefix = process.env.prefix;

const commandFiles = fs.readdirSync('src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on("ready", ()=>{
    //useful for tests
    console.log("I'm in");
});

client.on("message", function (message) {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('Deu certo aqui não, vey. Tenta de novo!');
	}

});

client.login(process.env.BOT_TOKEN);