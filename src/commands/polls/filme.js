const Discord = require('discord.js');
const emojis = require("../../data/emojiCharacters");
const {buildOptionsParagraph} = require('../../utils/StringBuilder');
const {uniqueReaction, roleOnReaction} = require('../../utils/Messages');

// hours
const EXPIRE_TIME = 12;

module.exports = {
	name: 'filme',
	aliases: ['f', 'movie'],
	description: 'Setup para registrar uma enquete de filmes',
	usage: `Como usar: "${process.env.prefix}filme"`,
	execute: (message, args) => {
        let title;
        message.channel.send('Digite um título para a mensagem.\nEx: Qual filmeh hojer?');
        message.channel.awaitMessages(m=>m, {max: 2, time: 90000, errors:['time']})
        .then( collected =>{
            title = collected.last().content;
            message.channel.send('Agora bota as opções ai vey. Ex: filme1 | filme2 | filme3 ou horario1 | horario2');
            return message.channel.awaitMessages(m=>m, {max: 2, time: 120000, errors:['time']});
        })
        .then( collected => {
            message.channel.bulkDelete(5);
            const movies = collected.last().content.split('|');
            const embedMessage = new Discord.MessageEmbed()
                                    .setColor('#FFF654')
                                    .setTitle(title)
                                    .setDescription(buildOptionsParagraph(movies))
                                    .setAuthor(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embedMessage).then(embedded => {                    
                movies.forEach((movie, idx) => {
                    embedded.react(emojis[idx+1]);
                })
                const movieRole = message.guild.roles.cache.find(role => role.name === process.env.MOVIE_ROLE);
                
                uniqueReaction(embedded);
                roleOnReaction(embedded, movieRole);
                embedded.delete({ timeout: EXPIRE_TIME * 3600000 });
            });
        })
        .catch( collected =>{
            message.reply('Demorou demais vey, acha que eu tenho o dia todo???');
        });
	},
};