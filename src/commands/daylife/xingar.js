const {createPhrase} = require('../../utils/StringBuilder');
const xingamentos = require("../../data/xingamentos");

module.exports = {
	name: 'xingar',
	aliases: ['x'],
	description: 'Xinga muito!',
	usage: `Como usar: "${process.env.prefix}xingar {pessoa}"`,
	execute: (message, args) => {
		const xingado = args.length ? args.join(' ') : 'Bolsonaro';
		
		const xingamento = xingamentos[Math.floor(Math.random() * xingamentos.length)];
        message.channel.send(`${xingamento} ${xingado}`);
	},
};