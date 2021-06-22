const Discord = require('discord.js');
const {uniqueReaction} = require('../../utils/Messages');
const {NotEnoughArgs} = require("../../utils/BotError");

const usage = `Como usar: "${process.env.prefix}votar {pergunta de sim/não}"`;

module.exports = {
	name: 'votar',
	aliases: ['poll', 'vote'],
	description: 'Gera uma votação para sim/não',
	usage,
	execute: (message, args) => {
        if(args.length === 0) throw new NotEnoughArgs(usage);
        const title = args.join(' ').trim();
        const embedMessage = new Discord.MessageEmbed()
            .setColor('#34BDEB')
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle(title.endsWith('?') ? title : title + '?')
            .setDescription('\n👍 Sim\n\n👎 Não\n');
        message.channel.send(embedMessage).then(embedded => {
            ['👍', '👎'].forEach((emoji) => embedded.react(emoji));
            uniqueReaction(embedded);
        });                
    }
}