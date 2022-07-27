const Discord = require('discord.js');
const randomColor = require('randomcolor');
const { percentBar } = require('../../utils/Messages');

const usage = `Como usar: "${process.env.prefix}cringe {pessoa}"`;

module.exports = {
	name: 'cringe',
	description: 'Quão cringe você é?',
	usage,
	execute: (message, args) => {

        const imgs = [new Discord.MessageAttachment('src/assets/img/cringe.jpg', 'cringe.jpg'),
                      new Discord.MessageAttachment('src/assets/img/derepente.jpg', 'cringe.jpg')]

        const percentage = percentBar();
        const embedMessage = new Discord.MessageEmbed()
            .setColor(randomColor())
            .setTitle('\nQuão cringe será que tu é? kk')
            .setDescription(`\n👇😗\n\n${percentage.bar}\n`)
            .attachFiles(percentage.value < 50 ? imgs[0] : imgs[1])
            .setImage('attachment://cringe.jpg')

        let guildMember = message.guild.members.cache.get(message.author.id);
        if(args.length > 0){
            guildMember = Boolean(args[0].match(/<@!*(.+)>/g))
            ? message.guild.members.cache.get(args[0].replace(/<@!*(.+)>/i, '$1'))
            : undefined;
        }
        if(guildMember) {
            embedMessage.setThumbnail(guildMember.user.displayAvatarURL())
            message.channel.send(guildMember.toString());
        } else embedMessage.setTitle(`\nQuão cringe será que tu é ${args.join(' ')}? kk`);

        message.channel.send(embedMessage);
	},
};