import { ChatInputCommandInteraction, CollectorFilter, MessageReaction, PermissionFlagsBits, User } from 'discord.js';
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

        let categories;
        if (votedCategories.length) categories = (await db.categories('1').where('title', 'not-in', votedCategories).get()).docs;
        else categories = (await db.categories('1').get()).docs;

        if (!categories.length) interaction.reply("Todos os seus votos já foram computados.\nAgora só aguardar o dia da premiação!");
        else {
            interaction.reply("Segue as categorias que precisam do seu voto!");
            categories.map(cat => cat.data()).forEach(async category => {
                const num_candidates = [category.candidate3, category.candidate4, category.candidate5].filter(Boolean).length + 2;
                const msg = await interaction.channel?.send(formatVotingCategory(category));

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
            });
        }
    }
}

export default Votar;
