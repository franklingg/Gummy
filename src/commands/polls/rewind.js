const {NotEnoughArgs} = require("../../utils/BotError");
const {uniqueReaction, roleOnReaction} = require('../../utils/Messages');

const usage = `Como usar: "${process.env.prefix}rewind {ID de mensagem}"`;

module.exports = {
	name: 'rewind',
	aliases: ['rw'],
	description: 'Retorna a ação de uma mensagem de filme',
	usage,
    args: true,
	execute: (message, args) => {
		if(args.length !== 1) throw new NotEnoughArgs(usage);

		const movieRole = message.guild.roles.cache.find(role => role.name === process.env.MOVIE_ROLE);
        message.channel.messages.fetch(args[0]).then(rewindMessage => {
			uniqueReaction(rewindMessage);
			roleOnReaction(rewindMessage, movieRole);
			rewindMessage.delete({ timeout: process.env.EXPIRE_TIME * 3600000 });
			message.channel.bulkDelete(1);
		});
	},
};