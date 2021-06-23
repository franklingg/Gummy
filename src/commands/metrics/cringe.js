const Discord = require('discord.js');
const { percentBar } = require('../../utils/Messages');

const usage = `Como usar: "${process.env.prefix}cringe {pessoa}"`;

module.exports = {
	name: 'cringe',
	description: 'Quão cringe você é?',
	usage,
	execute: (message, args) => {

        const cringeIMG = new Discord
                      .MessageAttachment('src/data/img/cringe.jpg', 'cringe.jpg');
        const embedMessage = new Discord.MessageEmbed()
            .setColor('#EB3434')
            .setTitle('\nQuão cringe será que tu é? kk')
            .setDescription(`\n👇😗\n\n${percentBar()}\n`)
            .attachFiles(cringeIMG)
            .setImage('attachment://cringe.jpg')

        let guildMember = message.guild.members.cache.get(message.author.id);
        if(args.length > 0){
            guildMember = Boolean(args[0].match(/<@!*(.+)>/g))
            ? message.guild.members.cache.get(args[0].replace(/<@!*(.+)>/g, '$1'))
            : undefined;
        }
        if(guildMember) {
            embedMessage.setThumbnail(guildMember.user.displayAvatarURL())
            message.channel.send(guildMember.toString());
        } else embedMessage.setTitle(`\nQuão cringe será que tu é ${args.join(' ')}? kk`);

        if(guildMember.user.username === 'franklingg'){
            const plus90 = Math.floor(Math.random() * 11) + 90;
            embedMessage.setDescription(`\n👇😗\n\n${percentBar(plus90)}\n`)
        }
        message.channel.send(embedMessage);
	},
};