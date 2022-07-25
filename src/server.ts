import dotenv from 'dotenv';
import { Client, Events, Partials, GatewayIntentBits } from 'discord.js';
import {BotError, NotEnoughArgs} from './utils/BotError';
import { availableCommands } from './commands/Command';
import { logBotError, logBotSuccess } from './utils/Logger';
import { initDb } from './db/connection';
import { Database } from 'sqlite';

dotenv.config();
let db : Database;

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds, 
		GatewayIntentBits.GuildMessages, 
		GatewayIntentBits.GuildPresences, 
		GatewayIntentBits.GuildMessageReactions, 
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent
	], 
	partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction] 
});

client.once(Events.ClientReady, async (c) =>{
	console.log("Entrei!");
	c.application.commands.set(availableCommands.map(c => ({ name: c.name, description: c.description, options: c.options})));
	const db_connection = await initDb();
	if(db_connection) db = db_connection;
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand() || interaction.user.bot) return;
	
	try {
		const command = availableCommands.find(c => c.name == interaction.commandName)
		await command?.execute(interaction, db);
		logBotSuccess(interaction);
	} catch (error) {
		if(error instanceof Error){
			logBotError(error, interaction);
			if (error instanceof BotError) interaction.reply(error.botMessage);
		}
	}
});

client.login(process.env.BOT_TOKEN);