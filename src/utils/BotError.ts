export class BotError extends Error {

    _botMessage: string;

    constructor(message : string){
        super(message);
        this._botMessage = message;
    }

    get botMessage(){
        return this._botMessage;
    }
}

export class NotEnoughArgs extends BotError {
    constructor(usage : string){
        super(`\nTa faltando ou tem coisa demais ai mo...\n${usage}`);
    }
}

export class InvalidArgs extends BotError {
    constructor(usage : string){
        super('Tu digitou coisa errada minha véa...\n ' + usage);
    }
}