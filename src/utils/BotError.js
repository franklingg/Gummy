class BotError extends Error {

    constructor(message){
        super(message);
        this._botMessage = message;
    }

    get botMessage(){
        return this._botMessage;
    }
}

class NotEnoughArgs extends BotError {
    constructor(usage){
        super(`\nTa faltando ou tem coisa demais ai mo...\n${usage}`);
    }
}

class InvalidArgs extends BotError {
    constructor(usage){
        super('Tu digitou coisa errada minha véa...\n ' + usage);
    }
}


module.exports = {
    BotError,
    NotEnoughArgs,
    InvalidArgs
}