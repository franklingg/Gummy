import { ApplicationCommandOptionType, ChatInputCommandInteraction} from 'discord.js';
import { Command } from '~/commands';

const Xingar : Command = {
    name: 'xingar',
    description: 'Xingue alguém!',
    options: [
        {
            type: ApplicationCommandOptionType.Mentionable,
            name: 'xingado',
            description: 'Quem você quer xingar',
            required: true,
        }
    ],

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const mentionedUser = interaction.options.getMentionable('xingado');
        await interaction.reply(`Ei, ${mentionedUser}, vai tomar no cu!`);
    }
}

export default Xingar;