import { ChatInputCommandInteraction} from 'discord.js';
import { Command } from '~/commands/Command';

const Testar : Command = {
    name: 'testar',
    description: 'Teste o bot!',

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply("O que é porra?");
    }
}

export default Testar;