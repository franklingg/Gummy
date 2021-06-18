
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

    // return array.reduce((phrase="", word, index)=>{
    //     if(index === array.length - 1) return ` ${phrase}${word}`;
    //     if(index === array.length - 2) return `${phrase}${word} e `;
    //     return `${phrase} ${word}, `;
    // });
};


module.exports = {
    createPhrase
}