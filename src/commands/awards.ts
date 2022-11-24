import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits, User } from 'discord.js';
import { Command } from './';
import { db } from '../firebase/db';
import { BotError, InvalidArgs } from '../utils/BotError';

const Awards: Command = {
    name: 'awards',
    description: 'Participar/Gerenciar premiações!',
    dm_permission: true,
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
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
            name: 'categoria',
            description: 'Adiciona uma nova categoria a um Awards/Premiação',
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "titulo",
                    description: "Título da categoria",
                    required: true
                },
                {
                    type: ApplicationCommandOptionType.User,
                    name: "candidato1",
                    description: "Candidato 1",
                    required: true
                },
                {
                    type: ApplicationCommandOptionType.User,
                    name: "candidato2",
                    description: "Candidato 2",
                    required: true
                },
                {
                    type: ApplicationCommandOptionType.User,
                    name: "candidato3",
                    description: "Candidato 3"
                },
                {
                    type: ApplicationCommandOptionType.User,
                    name: "candidato4",
                    description: "Candidato 4"
                },
                {
                    type: ApplicationCommandOptionType.User,
                    name: "candidato5",
                    description: "Candidato 5"
                }
            ]
        }
    ],

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'iniciar') {
            const title = interaction.options.getString('titulo', true);
            const subtitle = interaction.options.getString('subtitulo', true);
            const banner = interaction.options.getAttachment('banner');
            const role = interaction.options.getRole('role');

            if (banner && !/image\/\w+/ig.test(banner.contentType || '')) throw new InvalidArgs('Banner precisa ser uma imagem válida');
            const nextDoc = (await db.awards.count().get()).data().count + 1;

            await db.awards.doc(`${nextDoc}`).set({ title, subtitle, banner: banner?.url, role: role?.id });
            interaction.reply("Premiação criada!!")
        } else if (subcommand === 'categoria') {
            if((await db.awards.count().get()).data().count == 0) throw new BotError('Não tem como cadastrar categorias sem premiações, vey...');
            const title = interaction.options.getString('titulo', true);
            const cdt1 = interaction.options.getUser('candidato1', true);
            const cdt2 = interaction.options.getUser('candidato2', true);
            const cdt3 = interaction.options.getUser('candidato3');
            const cdt4 = interaction.options.getUser('candidato4');
            const cdt5 = interaction.options.getUser('candidato5');

            const nextDoc = (await db.categories('1').count().get()).data().count + 1;

            await db.categories('1').doc(`${nextDoc}`).set({ 
                title, 
                candidate1: cdt1.id, 
                candidate2: cdt2.id, 
                candidate3: cdt3?.id, 
                candidate4: cdt4?.id, 
                candidate5: cdt5?.id, 
            });
            interaction.reply("Categoria criada!!")
        } else {
            throw new BotError("Não dá pra fazer isso com um award, mô!");
        }
    }
}

export default Awards;