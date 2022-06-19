/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
Aex66 (Developer),
notbeer (ROT's base code)
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
__________ ___________________
\______   \\_____  \__    ___/
 |       _/ /   |   \|    |   
 |    |   \/    |    \    |   
 |____|_  /\_______  /____|   
        \/         \/         
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
© Copyright 2022 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Website: https://www.rotmc.ml
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Thank you!
*/
import Server from '../../ServerBook.js';
Server.command.register({
    cancelMessage: true,
    name: 'tagclear',
    description: 'Clears all of the tags off of a player. (expect the admin tag if they have it)',
    aliases: ['tc', 'tagc', 'tclear', 'tac'],
    category: 'Management',
    admin: true,
    documentation: {
        usage: 'tc <player>',
        examples: [
            'tclear Mo9ses',
            'tac Notbeer'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if(!Server.player.find(args.join(' '))) return Server.eBroadcast(Server.lang.playerDoesNOTexist, chatmsg.sender.name, 'RANKS');
    const player = Server.player.fetch(args.join(' ')), tags = player.getTags();
    Server.broadcast(`Removing §4${tags.length}§7 tags from §c${player.name}§7!`, chatmsg.sender.name, 'ROT');
    for(const tag of tags) if(tag !== 'v') player.removeTag(tag), Server.broadcast(`§cRemoved tag §a${tag},`, chatmsg.sender.name, '', false);
});