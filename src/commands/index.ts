import {ApplicationCommandDataResolvable, ApplicationCommandOptionData, ChatInputCommandInteraction} from 'discord.js';
import Awards from './awards';
import Xingar from './xingar';

export type Command = {
    name: string;
    description: string;
    options: Array<ApplicationCommandOptionData>;
    dm_permission?: boolean;
    execute(interaction: ChatInputCommandInteraction): Promise<void>;
};

const availableCommands = [
    Xingar,
    Awards
];

export { availableCommands };