import {ApplicationCommandDataResolvable, ApplicationCommandOptionData, ChatInputCommandInteraction} from 'discord.js';
import Awards from './awards';
import Votar from './votar';
import Xingar from './xingar';

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
    Votar
];

export { availableCommands };