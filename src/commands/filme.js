const {NotEnoughArgs, InvalidArgs} = require("../utils/BotError");

const steps = [
    {
        text: "Bora marcar esse filmer, digite um título e (se quiser) um subtítulo pra mensagem.\nNesse formato: TITULO | SUBTITULO",
    }
]

module.exports = {
	name: 'filme',
	aliases: ['f', 'movie'],
	description: 'Setup para registrar uma enquete de filmes',
	usage: `Como usar: "${process.env.prefix}filme"`,
	execute: (message, args) => {
        const collector = message.channel.createMessageCollector(r=>r, { time: 30000, errors: ['time'] });
        let step = 0;

        collector.on('collect', m =>{
            while(step < steps.length){
                if(m.content.trim() === 'fim') {
                    collector.stop();
                    break;
                }
                const nextStep = steps[step];
                message.channel.send(nextStep.text);
            }
        });

        collector.on('end', collected =>{
            message.channel.bulkDelete(collected.size, true);
        })
	},
};