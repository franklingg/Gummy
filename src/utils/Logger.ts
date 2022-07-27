import { ChatInputCommandInteraction } from 'discord.js';
import FS from 'fs';
var log_file = FS.createWriteStream('log/debug.log', {flags : 'a'});
var error_file = FS.createWriteStream('log/debug.error.log', {flags : 'a'});

export function logBotSuccess(interaction : ChatInputCommandInteraction) : void {
    const message = `${new Date().toLocaleString('pt-BR')} - ${interaction.commandName} - ${interaction.user.username}\n`;
    console.log(message);
    log_file.write(message);
}

export function logBotError(error: Error, interaction : ChatInputCommandInteraction) : void {
    const message = `${new Date().toLocaleString('pt-BR')} - ${error.message} - ${interaction.commandName} - ${interaction.user.username}\n`;
    console.error(message);
    error_file.write(message);
}