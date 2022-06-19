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
    name: 'gmc',
    description: 'Switches your or other members to creative mode more easily',
    aliases: ['gamemodec', 'modec', 'gm1'],
    category: 'Escape',
    documentation: {
        usage: 'gmc',
        examples: [
            'gmc'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if(!Server.basicToggleChecker('gmc', chatmsg.sender.name)) return;
    let player = chatmsg.sender.name;
    if(args[0]) {
        if(!Server.player.isAdmin(chatmsg.sender.name)) return Server.eBroadcast(Server.lang.unauthorized, chatmsg.sender.name, 'GMC');
        player = args.join(' ');
        if(!Server.player.find(player)) return Server.eBroadcast(Server.lang.playerDoesNOTexist, chatmsg.sender.name, 'GMC');
        Server.broadcast(`§c${player}§7 is now in creative mode!`, chatmsg.sender.name, 'GMC');
    }
    Server.runCommand('gamemode c ' + player);
    Server.broadcast('You are now in creative mode!', player, 'GMC');
});
Server.command.register({
    cancelMessage: true,
    name: 'gmct',
    description: `Toggles ${Server.lang.prefix}gmc so people can use ${Server.lang.prefix}gmc how you set it to`,
    aliases: ['gmctoggle', 'gmc-toggle', 'gm1t'],
    category: 'Escape',
    admin: true,
    documentation: {
        usage: 'gmct',
        examples: [
            'gmct'
        ],
        developers: ['Mo9ses']
    }
}, chatmsg => Server.basicCommandToggle('gmc', chatmsg.sender.name));