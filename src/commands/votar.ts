import { ChatInputCommandInteraction, Message, PermissionFlagsBits } from 'discord.js';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { Command } from '~/commands';
import { Category } from '~/firebase/types';
import { db } from '../firebase/db';
import { capitalize } from '../utils/Logger';

const numberEmojis = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣'];

function formatVotingCategory(category: Category): string {
    let message = `
**${capitalize(category.title)}**
*${capitalize(category.description)}*
    \t${numberEmojis[0]} ${category.candidate1}
    \t${numberEmojis[1]} ${category.candidate2}`;

    if (category.candidate3) message = `${message}\n\t\t${numberEmojis[2]} ${category.candidate3}`;
    if (category.candidate4) message = `${message}\n\t\t${numberEmojis[3]} ${category.candidate4}`;
    if (category.candidate5) message = `${message}\n\t\t${numberEmojis[4]} ${category.candidate5}`;

    return message;
}

const Votar: Command = {
    name: 'votar',
    description: 'Vote em um awards',
    dm_permission: true,
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const computedVotes = (await db.votes.where('voter', '==', interaction.user.id).get()).docs;
        const votedCategories = computedVotes.flatMap(doc => doc.data().category);

        let categories : QueryDocumentSnapshot<Category>[];
        if (votedCategories.length) {
            categories = (await db.categories('1').get()).docs;
            categories = categories.filter(cat => !votedCategories.includes(cat.data().title));
        }
        else categories = (await db.categories('1').get()).docs;

        if (!categories.length) interaction.reply("Todos os seus votos já foram computados.\nAgora só aguardar o dia da premiação!");
        else {
            interaction.reply("Seguem as categorias que precisam do seu voto!");
            const categoriesOrdered = categories.map(cat => cat.data()).sort((a, b) => { return a.isBanner ? 0 : !a.isMultimedia ? -1 : 1 }); 
            for(const category of categoriesOrdered) {
                const num_candidates = [category.candidate3, category.candidate4, category.candidate5].filter(Boolean).length + 2;
                let msg : Message | undefined;
                if (category.isBanner) {
                    msg = await interaction.channel?.send({
                        content: `**${capitalize(category.title)}**\n`,
                        files: [category.description]
                    });
                } else if (category.isMultimedia){
                    for(let i=0; i < num_candidates; i++){
                        const content = (i == 0 ? `**${capitalize(category.title)}**\n\t*${capitalize(category.description)}*\n` : "") +  `-${numberEmojis[i]}`;
                        const sentMsg = await interaction.channel?.send({
                            content, 
                            files: [category[`candidate${i+1}`]]
                        });
                        if(i === num_candidates-1) msg = sentMsg;
                    }
                } else msg = await interaction.channel?.send(formatVotingCategory(category));

                for (const i in Array.from(Array(num_candidates))) {
                    await msg?.react(numberEmojis[i]);
                }

                const collector = msg?.createReactionCollector({
                    filter: (reaction, user) => {
                        return user.id === interaction.user.id && numberEmojis.includes(reaction.emoji.name || "");
                    }
                });

                collector?.once('collect', (reaction, user) => {
                    const numberChosen = numberEmojis.findIndex(emoji => emoji === reaction.emoji.name) + 1;
                    db.votes.add({
                        category: category.title,
                        voter: user.id,
                        choice: numberChosen
                    });
                });
            }
            interaction.channel?.send("Já pode votar gata, barbariza ai :nail_care:")
        }
    }
}

export default Votar;