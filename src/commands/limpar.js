const {NotEnoughArgs, InvalidArgs} = require("../utils/BotError");

const usage = `Como usar: "${process.env.prefix}limpar {nº de mensagens}"`;

module.exports = {
	name: 'limpar',
	aliases: ['l', 'clean'],
	description: 'Limpa mensagens',
	usage,
    args: true,
	execute: (message, args) => {
		const amount = parseInt(args[0]) + 1;
		if(args.length > 1) throw new NotEnoughArgs(usage);
		else if(isNaN(amount)) throw new InvalidArgs(usage);

		message.channel.bulkDelete(amount, true);
	},
};