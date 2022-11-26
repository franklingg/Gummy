import { ChatInputCommandInteraction, PermissionFlagsBits} from 'discord.js';
import { Command } from '~/commands';

const Votar : Command = {
    name: 'votar',
    description: 'Vote em um awards',
    dm_permission: true,
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const mentionedUser = interaction.options.getMentionable('xingado');
        await interaction.reply(`Ei, ${mentionedUser}, vai tomar no cu!`);
    }
}

export default Votar;