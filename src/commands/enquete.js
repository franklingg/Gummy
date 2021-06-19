const Discord = require('discord.js');
const {uniqueReaction} = require('../utils/Messages');
const emojis = require("../data/emojiCharacters");
const {buildOptionsParagraph} = require('../utils/StringBuilder');
const {NotEnoughArgs} = require("../utils/BotError");

const usage = `Como usar: "${process.env.prefix}votar {pergunta} | Opção 1 | Opção 2 | ..."`;

module.exports = {
	name: 'enquete',
	aliases: ['e'],
	description: 'Gera uma votação para múltiplos valores',
	usage,
	execute: (message, args) => {
        if(args.length <= 2) throw new NotEnoughArgs(usage);
        message.channel.bulkDelete(1);
        const [title, ...options] = args.join(' ').split('|').map(s => s.trim());

        const embedMessage = new Discord.MessageEmbed()
            .setColor('#F4ADEB')
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle(title.endsWith('?') ? title : title + '?')
            .setDescription(buildOptionsParagraph(options));
        message.channel.send(embedMessage).then(embedded => {
            options.forEach((option, idx) => embedded.react(emojis[idx+1]));
            uniqueReaction(embedded);
        });                
    }
}