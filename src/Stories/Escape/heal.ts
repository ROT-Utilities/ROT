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
    name: 'heal',
    description: `When you type ${Server.lang.prefix}heal in chat... I'll heal you!`,
    category: 'Escape',
    aliases: ['hea', 'he', 'ha'],
    documentation: {
        usage: 'heal <player?>',
        examples: [
            'heal',
            'heal Mo9ses'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if(!Server.basicToggleChecker('heal', chatmsg.sender.name)) return;
    if(args.join(' ') !== '') {
        if(!Server.player.isAdmin(chatmsg.sender.name)) return Server.eBroadcast(Server.lang.unauthorized, chatmsg.sender.name, 'HEAL');
        if(args.join(' ').startsWith('@')) var player = args.join(' '); else {
            if(!Server.player.find(args.join(' '))) return Server.eBroadcast(Server.lang.playerDoesNOTexist, chatmsg.sender.name, 'HEAL');
            player = `"${args.join(' ')}"`;
        }
    } else player = `"${chatmsg.sender.name}"`;
    Server.broadcast('You have been healed!', player, 'HEAL');
    Server.runCommand(`effect ${player} instant_health 2 255 true`);
});
Server.command.register({
    cancelMessage: true,
    name: 'healt',
    description: `Toggles ${Server.lang.prefix}heal so people can use ${Server.lang.prefix}heal how you set it to!`,
    aliases: ['healtoggle', 'heal-toggle'],
    category: 'Escape',
    admin: true,
    documentation: {
        usage: 'healt',
        examples: [
            'healt'
        ],
        developers: ['Mo9ses']
    }
}, chatmsg => Server.basicCommandToggle('heal', chatmsg.sender.name));