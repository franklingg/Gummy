import {ApplicationCommandOptionData, ChatInputCommandInteraction} from 'discord.js';
import { Database } from "sqlite";
import Category from './category';
import Xingar from './xingar';

export type Command = {
    name: string;
    description: string;
    options: Array<ApplicationCommandOptionData>,
    execute(interaction: ChatInputCommandInteraction, db?: Database): Promise<void>;
}


const availableCommands = [
    Xingar,
    Category
];

export { availableCommands };