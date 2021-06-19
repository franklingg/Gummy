
const uniqueReaction = (message) => {
    const collector = message.createReactionCollector((r, u) => r, { dispose: true });
    collector.on('collect', (reaction, user)=>{
        if(!user.bot){
            const userReactions = message.reactions.cache.filter(r => r.users.cache.has(user.id) && r !== reaction);
            userReactions.forEach(r => r.users.remove(user.id));
        }
    });
}

const roleOnReaction = (message, role) => {
    const collector = message.createReactionCollector((r, u) => r, { dispose: true });
    collector.on('collect', (reaction, user)=>{
        const reactMember = message.guild.member(user);
        if(reactMember && !user.bot) {
            reactMember.roles.add(role);
        }
    });
    collector.on('remove', (reaction, user) => {
        const reactMember = message.guild.member(user);
        if(reactMember && !user.bot){
            const userReactions = message.reactions.cache.filter(r => r.users.cache.has(user.id));
            if (userReactions.array().length === 0){
                reactMember.roles.remove(role);
            }
        }
    });
    collector.on('end', () => {
        message.guild.members.cache.forEach(member => {
            member.roles.remove(role);
        });
    });
};

module.exports= {
    uniqueReaction,
    roleOnReaction
}