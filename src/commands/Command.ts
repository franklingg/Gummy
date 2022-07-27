import {ChatInputCommandInteraction, ApplicationCommand} from 'discord.js';
import Testar from './testar';

export type Command = {
    name: string;
    description: string;
    execute(interaction: ChatInputCommandInteraction): Promise<void>;
}


const availableCommands = [
    Testar
];

export { availableCommands };