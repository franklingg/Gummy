import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits} from 'discord.js';
import { Command } from '~/commands';

const Xingar : Command = {
    name: 'xingar',
    description: 'Xingue alguém!',
    defaultMemberPermissions: PermissionFlagsBits.SendMessages,
    dm_permission: false,
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