import { ApplicationCommandOptionType, AttachmentBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { Command } from '~/commands';
import { Award, Category, Vote } from '~/firebase/types';
import { BotError } from '../utils/BotError';
import { db } from '../firebase/db';

const numberEmojis = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣'];

function findWinner(votes: Vote[]): number[] {
    const results = [0,0,0,0,0];
    votes.forEach(vote => {
        results[vote.choice-1]++;
    });
    const winners = results.reduce<number[]>((w,el,i) => (el === Math.max(...results) ? [...w, i] : w),[]);
    return winners;
}

const Estatisticas: Command = {
    name: 'estatisticas',
    description: 'Informações sobre premiações',
    dm_permission: false,
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'votantes',
            description: 'Estado atual de votação em um awards.'
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'resultado',
            description: 'Resultados até então de uma premiação.'
        }
    ],
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const subcommand = interaction.options.getSubcommand();
        const award = (await db.awards.doc('1').get()).data();

        if (subcommand === 'resultado') {
            const computedVotes = (await db.votes.get()).docs.map(v => v.data());
            
            if(!award || !computedVotes.length) interaction.reply("Não há votos registrados.\nCrie categorias ou espere os votos serem registrados!");    
            else {
                const categories = (await db.categories('1').get()).docs.map(c => c.data());
                await interaction.channel?.send(`*Resultados Prévios*\n__${award.title}__`);
                categories.forEach(async category => {
                    const votesCategory = computedVotes.filter(vote => vote.category === category.title);
                    let resultMessage = `>>\n**${category.title}**\n*${category.description}*\n`;
                    
                    const winners = findWinner(votesCategory);
                    if(category.isMultimedia) {
                        resultMessage += `Vencedor${winners.length !== 1 ? "es" : ''}:`;
                        await interaction.channel?.send({
                            content: resultMessage, 
                            files: winners.map(w => ({
                                attachment: category[`candidate${w+1}`],
                                name: `SPOILER_cat.jpg`
                            }))
                        });
                    } else {
                        if(winners.length === 1) resultMessage += `Vencedor: ||${category[`candidate${winners[0]+1}`]}||`;
                        else resultMessage += `Vencedores: || ${winners.reduce((a, w) => (a + '\t' + w), "")} ||`;
                        await interaction.channel?.send(resultMessage);
                    }
                });
            }
        } else if (subcommand === 'votantes') {
            const computedVotes = (await db.votes.get()).docs.map(v => v.data());
            
            if(!award || !computedVotes.length) interaction.reply("Não há votos registrados.\nCrie categorias ou espere os votos serem registrados!");    
            else {
                const categories = (await db.categories('1').get()).docs.map(c => c.data());
                const allVoters = (await interaction.guild?.roles.fetch(award.role || "", {force: true}))?.members;
                let resultMessage = `
                    :gem: :sparkles: :speaking_head: :partying_face: :dog: :sweat_drops: :eggplant: :peach: :pleading_face: :sob: :nail_care: :rainbow_flag: :pray:\n
                    *Resultados Prévios*
                    **${award.title}**
                    
                    Quantidade de categorias: ${categories.length}
                    Total de votos: ${computedVotes.length}\n
                    Votantes (Votos efetuados/Total necessário):\n`;
                allVoters?.forEach(voter => {
                    resultMessage += `\t\t\t\t\t<@${voter.id}>\t\t\t${computedVotes.filter(v => v.voter === voter.id).length}/${categories.length}\n`
                });
                
                interaction.reply(resultMessage + "\n:high_heel: :lips: :lipstick: :heart_eyes: :face_holding_back_tears::woman_tipping_hand: :hand_with_index_finger_and_thumb_crossed: :biting_lip: :scream: :new_moon_with_face: :baby_bottle: :dollar: :closed_lock_with_key:");
            }
        } else {
            throw new BotError("Não dá pra fazer isso com um award, mô!");
        }
    }
}

export default Estatisticas;