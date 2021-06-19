const emojis = require("../data/emojiCharacters");

const createPhrase = (array) => {
    if(array.length === 0) return "";

    let phrase = "";

    for(let i=0; i < array.length; i++){
        const word = array[i];
        if(i === array.length - 1) {
            phrase += word;
        } else if(i === array.length - 2) {
            phrase += word + ' e ';
        } else {
            phrase += word + ', ';
        }
    }
    return phrase;
};

const buildOptionsParagraph = (args) => {
    return args.map((opt, idx) => `\n${emojis[idx+1]} ${opt}\n`).join('');
}


module.exports = {
    createPhrase,
    buildOptionsParagraph
}