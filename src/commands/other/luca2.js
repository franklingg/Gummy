module.exports = {
	name: 'luca2',
	description: 'Frase do Luca pesadinha!',
	usage: `Como usar: "${process.env.prefix}luca2"`,
	execute: (message, args) => {
        message.channel.send(`Vai pro inferno, Bruno!`);
	},
};