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
    name: 'gms',
    description: 'Switches your or other members to survival mode more easily',
    aliases: ['gamemodes', 'modes', 'gm0'],
    category: 'Escape',
    admin: true,
    documentation: {
        usage: 'gms',
        examples: [
            'gms'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if(!Server.basicToggleChecker('gms', chatmsg.sender.name)) return;
    let player = chatmsg.sender.name;
    if(args[0]) {
        if(!Server.player.isAdmin(chatmsg.sender.name)) return Server.eBroadcast(Server.lang.unauthorized, chatmsg.sender.name, 'GMS');
        player = args.join(' ');
        if(!Server.player.find(player)) return Server.eBroadcast(Server.lang.playerDoesNOTexist, chatmsg.sender.name, 'GMS');
        Server.broadcast(`§c${player}§7 is now in survival mode!`, chatmsg.sender.name, 'GMS');
    }
    Server.runCommand('gamemode s ' + player);
    Server.broadcast('You are now in survival mode!', player, 'GMS');
});
Server.command.register({
    cancelMessage: true,
    name: 'gmst',
    description: `Toggles ${Server.lang.prefix}gms so people can use ${Server.lang.prefix}gms how you set it to`,
    aliases: ['gmstoggle', 'gms-toggle', 'gmst'],
    category: 'Escape',
    admin: true,
    documentation: {
        usage: 'gmst',
        examples: [
            'gmst'
        ],
        developers: ['Mo9ses']
    }
}, chatmsg => Server.basicCommandToggle('gms', chatmsg.sender.name));