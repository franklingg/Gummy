import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits, User } from 'discord.js';
import { Command } from './';
import { db } from '../firebase/db';
import { BotError, InvalidArgs } from '../utils/BotError';
import { Award } from '~/firebase/types';

const dmMessage = (award?: Award) => `
:gem: :sparkles: :speaking_head: :partying_face: :dog: :sweat_drops: :eggplant: :peach: :pleading_face: :sob: :nail_care: :rainbow_flag: :pray: :high_heel: :lips: :lipstick: :heart_eyes: :face_holding_back_tears::woman_tipping_hand: :hand_with_index_finger_and_thumb_crossed: :biting_lip: :scream: :new_moon_with_face: :baby_bottle: :dollar: :closed_lock_with_key: :cross:
**${award?.title}**
*${award?.subtitle}*

Precisamos que você registre seus votos!! 
Basta digitar o comando \`/votar\` (aqui mesmo) que o Gummy trará todas as categorias que precisam do seu voto.
(Pode levar um tempinho para aparecer todas as categorias, já que algumas possuem áudio/vídeo).
Atenção, uma vez que você reaja na mensagem, o voto é registrado, desmarcar/mudar a reação não o registrará novamente.
`

const Awards: Command = {
    name: 'awards',
    description: 'Participar/Gerenciar premiações!',
    dm_permission: false,
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'cadastrar',
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
                    type: ApplicationCommandOptionType.Role,
                    name: "role",
                    description: "Role associada à premiação",
                    required: true
                },
                {
                    type: ApplicationCommandOptionType.Attachment,
                    name: "banner",
                    description: "Banner ou imagem para a premiação"
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
                    type: ApplicationCommandOptionType.String,
                    name: "descricao",
                    description: "Descrição da categoria",
                    required: true
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "candidato1",
                    description: "Candidato 1",
                    required: true
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "candidato2",
                    description: "Candidato 2",
                    required: true
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "candidato3",
                    description: "Candidato 3"
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "candidato4",
                    description: "Candidato 4"
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "candidato5",
                    description: "Candidato 5"
                }
            ]
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'categoria_multimidia',
            description: 'Adiciona uma nova categoria com multimídia a um Awards/Premiação',
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "titulo",
                    description: "Título da categoria",
                    required: true
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "descricao",
                    description: "Descrição da categoria",
                    required: true
                },
                {
                    type: ApplicationCommandOptionType.Attachment,
                    name: "candidato1",
                    description: "Candidato 1",
                    required: true
                },
                {
                    type: ApplicationCommandOptionType.Attachment,
                    name: "candidato2",
                    description: "Candidato 2",
                    required: true
                },
                {
                    type: ApplicationCommandOptionType.Attachment,
                    name: "candidato3",
                    description: "Candidato 3"
                },
                {
                    type: ApplicationCommandOptionType.Attachment,
                    name: "candidato4",
                    description: "Candidato 4"
                },
                {
                    type: ApplicationCommandOptionType.Attachment,
                    name: "candidato5",
                    description: "Candidato 5"
                }
            ]
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'disparar',
            description: 'Dispara votação na DM entre todos os cadastrados em um awards.'
        }
    ],

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'cadastrar') {
            const title = interaction.options.getString('titulo', true);
            const subtitle = interaction.options.getString('subtitulo', true);
            const banner = interaction.options.getAttachment('banner');
            const role = interaction.options.getRole('role');

            if (banner && !/image\/\w+/ig.test(banner.contentType || '')) throw new InvalidArgs('Banner precisa ser uma imagem válida');
            const nextDoc = (await db.awards.count().get()).data().count + 1;

            await db.awards.doc(`${nextDoc}`).set({ title, subtitle, banner: banner?.url, role: role?.id });
            interaction.reply("Premiação criada!!");

        } else if (subcommand === 'categoria') {
            if ((await db.awards.count().get()).data().count == 0) throw new BotError('Não tem como cadastrar categorias sem premiações, vey...');
            const title = interaction.options.getString('titulo', true);
            const description = interaction.options.getString('descricao', true);
            const cdt1 = interaction.options.getString('candidato1', true);
            const cdt2 = interaction.options.getString('candidato2', true);
            const cdt3 = interaction.options.getString('candidato3');
            const cdt4 = interaction.options.getString('candidato4');
            const cdt5 = interaction.options.getString('candidato5');
            const nextDoc = (await db.categories('1').count().get()).data().count + 1;

            await db.categories('1').doc(`${nextDoc}`).set({
                title,
                description,
                candidate1: cdt1,
                candidate2: cdt2,
                candidate3: cdt3,
                candidate4: cdt4,
                candidate5: cdt5,
                isMultimedia: false
            });
            interaction.reply("Categoria criada!!");
        } else if (subcommand === 'categoria_multimidia') {
            if ((await db.awards.count().get()).data().count == 0) throw new BotError('Não tem como cadastrar categorias sem premiações, vey...');
            const title = interaction.options.getString('titulo', true);
            const description = interaction.options.getString('descricao', true);
            const cdt1 = interaction.options.getAttachment('candidato1', true);
            const cdt2 = interaction.options.getAttachment('candidato2', true);
            const cdt3 = interaction.options.getAttachment('candidato3');
            const cdt4 = interaction.options.getAttachment('candidato4');
            const cdt5 = interaction.options.getAttachment('candidato5');
            if ([cdt1, cdt2, cdt3, cdt4, cdt5].some(cdt => cdt && !/(audio|image|video)\/.*/.test(cdt.contentType || ""))) {
                throw new InvalidArgs("\nFormato do arquivo inválido. \nSão permitidas apenas arquivos de imagem, áudio ou vídeo");
            }
            const nextDoc = (await db.categories('1').count().get()).data().count + 1;

            await db.categories('1').doc(`${nextDoc}`).set({
                title,
                description,
                candidate1: cdt1.url,
                candidate2: cdt2.url,
                candidate3: cdt3?.url || null,
                candidate4: cdt4?.url || null,
                candidate5: cdt5?.url || null,
                isMultimedia: true
            });
            interaction.reply("Categoria criada!!");
        } else if (subcommand === 'disparar') {
            const awards = (await db.awards.doc('1').get()).data();
            const membersToSend = (await interaction.guild?.roles.fetch(awards?.role || ""))?.members;

            membersToSend?.each(member => {
                member.createDM(true).then(channel => channel.send({ content: dmMessage(awards), files: awards?.banner ? [{ attachment: awards.banner!, name: "banner.jpg" }] : [] }));
            });
            interaction.reply("Enviado a todes es convidades");
        } else {
            throw new BotError("Não dá pra fazer isso com um award, mô!");
        }
    }
}

export default Awards;