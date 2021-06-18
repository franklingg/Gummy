const Discord = require('discord.js');
const {NotEnoughArgs, InvalidArgs} = require("../utils/BotError");
const emojis = require("../data/emojiCharacters");

module.exports = {
	name: 'filme',
	aliases: ['f', 'movie'],
	description: 'Setup para registrar uma enquete de filmes',
	usage: `Como usar: "${process.env.prefix}filme"`,
	execute: (message, args) => {
        let title, subtitle;
        message.channel.send('Digite um título e subtítulo (se quiser) para a mensagem.\nEx: Qual filmeh hojer? | Fala logo vey');
        message.channel.awaitMessages(m=>m, {max: 2, time: 90000, errors:['time']})
        .then( collected =>{
            [title, subtitle] = collected.last().content.split('|');
            message.channel.send('Agora bota as opções ai vey. Ex: filme1 | filme2 | filme3');
            return message.channel.awaitMessages(m=>m, {max: 2, time: 120000, errors:['time']});
        })
        .then( collected => {
            message.channel.bulkDelete(5);
            const movies = collected.last().content.split('|');
            const embedMessage = new Discord.MessageEmbed()
                                    .setColor('#FFF654')
                                    .setTitle(title)
                                    .setDescription(subtitle || '')
                                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                                    .addFields(
                                        movies.map((movie, idx)=>{
                                            return { name: `Opção ${idx+1}`, value: movie.trim(), inline: true}
                                        })
                                    );
            message.channel.send(embedMessage).then(embedded => {                    
                movies.forEach((movie, idx) => {
                    embedded.react(emojis[idx+1]);
                })
                const movieRole = message.guild.roles.cache.find(role => role.name === process.env.MOVIE_ROLE);
                const collector = embedded.createReactionCollector((r, u) => r);
                collector.on('collect', (reaction, user)=>{
                    const reactMember = message.guild.members.cache.filter(member => {
                        console.log(member.username);
                        return member.username === user.username
                    }).first();
                    if(reactMember) {
                        console.log(reactMember);
                        reactMember.roles.add(movieRole);
                    }
                });
            });
        })
        .catch( collected =>{
            message.reply('Demorou demais vey, acha que eu tenho o dia todo???');
        });
	},
};