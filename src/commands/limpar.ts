import { ApplicationCommandOptionType, ChatInputCommandInteraction, Message, PermissionFlagsBits} from 'discord.js';
import { Command } from '~/commands';

const Limpar : Command = {
    name: 'limpar',
    description: 'Limpe mensagens do Bot',
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    dm_permission: false,
    options: [
        {
            type: ApplicationCommandOptionType.Integer,
            name: 'quantidade',
            description: 'Quantidade de mensagens a deletar',
            required: true,
            min_value: 0
        }
    ],

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const messages = await interaction.channel?.messages.fetch();
        let amount = interaction.options.getInteger('quantidade') || 0;
        let amountLeft = amount;
        if(messages){
            for(const message of messages){
                if(amountLeft == 0) break;
                if(message[1].author.bot && message[1].deletable){
                    message[1].delete();
                    amountLeft--;
                }
            }
        }
        interaction.reply(`Limpei ${amount} mensagens!`);
    }
}

export default Limpar;