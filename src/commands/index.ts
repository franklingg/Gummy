import {ApplicationCommandDataResolvable, ApplicationCommandOptionData, ChatInputCommandInteraction} from 'discord.js';
import Awards from './awards';
import Estatisticas from './estatisticas';
import Votar from './votar';
import Xingar from './xingar';
import Limpar from './limpar';

export type Command = {
    name: string;
    description: string;
    options?: Array<ApplicationCommandOptionData>;
    dm_permission?: boolean;
    execute(interaction: ChatInputCommandInteraction): Promise<void>;
} & ApplicationCommandDataResolvable;

const availableCommands = [
    Xingar,
    Awards,
    Votar,
    Estatisticas,
    Limpar
];

export { availableCommands };