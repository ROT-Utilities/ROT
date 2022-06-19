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
const registerInformationFEED = {
    cancelMessage: true,
    name: 'feed',
    description: `When you type ${Server.lang.prefix}feed in chat... I'll feed you`,
    aliases: ['f', 'food', 'hunger', 'saturation'],
    category: 'Escape',
    documentation: {
        usage: 'feed <player?>',
        examples: [
            'feed',
            'feed Africa',
            'feed notbeer'
        ],
        developers: ['Mo9ses']
    }
};
Server.command.register(registerInformationFEED, (chatmsg, args) => {
    if(!Server.basicToggleChecker('feed', chatmsg.sender.name)) return;
    if(args[0]) {
        if(!Server.player.isAdmin(chatmsg.sender.name)) return Server.eBroadcast(Server.lang.unauthorized, chatmsg.sender.name, 'FEED');
        if(args[0].startsWith('@')) var player = args.join(' '); else {
            if(!Server.player.find(args.join(' '))) return Server.eBroadcast(Server.lang.playerDoesNOTexist, chatmsg.sender.name, 'FEED');
            player = `"${args.join(' ')}"`;
        }
    } else player = `"${chatmsg.sender.name}"`;
    Server.broadcast('You have been feeded!', player, 'FEED');
    Server.runCommand(`effect ${player} saturation 2 255 true`);
});
Server.command.register({
    cancelMessage: true,
    name: 'feedt',
    description: `Toggles ${Server.lang.prefix}feed so people can use ${Server.lang.prefix}feed how you set it to!`,
    aliases: ['feedtoggle', 'feed-toggle'],
    category: 'Escape',
    admin: true,
    documentation: {
        usage: 'feedt',
        examples: [
            'feedt'
        ],
        developers: ['Mo9ses']
    }
}, chatmsg => Server.basicCommandToggle('feed', chatmsg.sender.name));