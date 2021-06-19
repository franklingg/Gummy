module.exports = {
	name: 'luca',
	description: 'Frase do Luca!',
	usage: `Como usar: "${process.env.prefix}luca"`,
	execute: (message, args) => {
        message.channel.send(`Silenzio, Bruno!`);
	},
};