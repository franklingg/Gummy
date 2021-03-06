const Discord = require('discord.js');
const randomColor = require('randomcolor');
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
            .setColor(randomColor())
            .setAuthor(message.guild.members.cache.get(message.author.id).nickname,
                       message.author.displayAvatarURL())
            .setTitle(title.endsWith('?') ? title : title + '?')
            .setDescription('\n👍 Sim\n\n👎 Não\n');
        message.channel.send(embedMessage).then(embedded => {
            ['👍', '👎'].forEach((emoji) => embedded.react(emoji));
            uniqueReaction(embedded);
        });                
    }
}