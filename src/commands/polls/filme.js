const Discord = require('discord.js');
const randomColor = require('randomcolor');
const emojis = require("../../data/emojiCharacters");
const {buildOptionsParagraph} = require('../../utils/StringBuilder');
const {uniqueReaction, roleOnReaction} = require('../../utils/Messages');
const {NotEnoughArgs} = require("../../utils/BotError");


const usage = `Como usar: "${process.env.prefix}filme titulo / opcao1 / opcao2 / opcao3"`;
module.exports = {
	name: 'filme',
	aliases: ['f', 'movie'],
	description: 'Setup para registrar uma enquete de filmes',
	usage,
	execute: (message, args) => {
        if(args.length < 1) throw new NotEnoughArgs(usage);

        const [title, ...options] = args.join(' ').split('/');
        const movies = options.filter(option => option.trim() !== '/');
        const embedMessage = new Discord.MessageEmbed()
                                .setColor(randomColor())
                                .setTitle(title)
                                .setDescription(buildOptionsParagraph(movies))
                                .setAuthor(message.guild.members.cache.get(message.author.id).nickname,
                                           message.author.displayAvatarURL())
        if(message.attachments.array()[0]){
            embedMessage.setImage(message.attachments.array()[0].url);
        }
        message.channel.bulkDelete(1);

        message.channel.send(embedMessage).then(embedded => {                    
            movies.forEach((movie, idx) => {
                embedded.react(emojis[idx+1]);
            })
            const movieRole = message.guild.roles.cache.find(role => role.name === process.env.MOVIE_ROLE);
            
            uniqueReaction(embedded);
            roleOnReaction(embedded, movieRole);
            embedded.delete({ timeout: process.env.EXPIRE_TIME * 3600000 });
        });
	},
};