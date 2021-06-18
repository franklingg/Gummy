require('dotenv').config();
const fs = require('fs');
const Discord = require("discord.js");
const {BotError, NotEnoughArgs} = require('./utils/BotError');

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
    const commandName = args.shift().toLowerCase();
	
	const command = client.commands.get(commandName) 
					|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
					
	try {
		if(!command) throw new BotError('Num faço a menor do que tu quer com issor kkk');
		if(command.args && !args.length) throw new NotEnoughArgs(command.usage);
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		if(error instanceof BotError){
			message.reply(error.botMessage);
		} else {
			message.reply('Deu certo aqui não, vey. Tenta de outra forma!');
		}
	}

});

client.login(process.env.BOT_TOKEN);