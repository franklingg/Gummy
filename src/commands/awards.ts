import { ApplicationCommandOptionType, ChatInputCommandInteraction} from 'discord.js';
import { Command } from '~/commands';
import { db } from '~/firebase/db';
import { Award } from '~/firebase/types';
import { BotError, InvalidArgs } from '../utils/BotError';

const Awards : Command = {
    name: 'awards',
    description: 'Participar/Gerenciar premiações!',
    dm_permission: true,
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'iniciar',
            description: 'Cadastre um novo Awards/Premiação',
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    name: "titulo",
                    description: "Título da sua premiação"
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "subtitulo",
                    required: true,
                    description: "Subtítulo ou chamada para o evento"
                },
                {
                    type: ApplicationCommandOptionType.Attachment,
                    name: "banner",
                    description: "Banner ou imagem para a premiação"
                },
                {
                    type: ApplicationCommandOptionType.Role,
                    name: "role",
                    description: "Role associada à premiação"
                }
            ]
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'remover',
            description: 'Remove um Awards/Premiação',
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "titulo",
                    description: "Award a ser removido",
                    required: true,
                    choices: [
                        {
                            name: "a",
                            value: "a"
                        },
                        {
                            name: "b",
                            value: "a"
                        }
                    ]
                }
            ]
        },  
    ],

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const subcommand = interaction.options.data[0].name;
        const subcommandArgs = interaction.options.data[0].options;

        switch(subcommand){
            case 'iniciar':
                const title = subcommandArgs?.find(c => c.name == 'titulo')?.value;
                const subtitle = subcommandArgs?.find(c => c.name == 'subtitulo')?.value;
                const banner = subcommandArgs?.find(c => c.name == 'banner')?.attachment;
                const role = subcommandArgs?.find(c => c.name == 'role')?.value;

                if(banner && !/image\/\w+/ig.test(banner.contentType || '')) throw new InvalidArgs('Banner precisa ser uma imagem válida');
                // await db.awards.add({title, subtitle, banner });
                break;
            default:
                throw new BotError("Não dá pra fazer isso com um award, mô!");
        }
    }
}

export default Awards;