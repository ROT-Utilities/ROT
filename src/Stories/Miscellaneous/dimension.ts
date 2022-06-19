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
import { Location, world } from 'mojang-minecraft';
import Server from '../../ServerBook.js';
Server.command.register({
    cancelMessage: true,
    name: 'dimension',
    description: 'Teleport to a dimension',
    aliases: ['dim', 'mins', 'place'],
    category: 'Miscellaneous',
    documentation: {
        usage: 'dimension <dimension> <X-Y-Z?> <player?>',
        information: 'This command will teleport the command sender, or who the command sender selects to the end.',
        examples: [
            'dim overworld 0 3 4 Mo9ses',
            'dim end 900 50 60 notbeer',
            'dim nether 90 30 40'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if(!Server.basicToggleChecker('dimension', chatmsg.sender.name)) return;
    if(args[4]) {
        if(!Server.player.isAdmin(chatmsg.sender.name)) return Server.eBroadcast(Server.lang.unauthorized, chatmsg.sender.name, 'DIM');
        var player = args.slice(4).join(' ');
        if(!Server.player.find(player)) return Server.eBroadcast(Server.lang.playerDoesNOTexist, chatmsg.sender.name, 'DIM');
    } else player = chatmsg.sender.name;
    if(args[0] !== 'overworld' && args[0] !== 'nether' && args[0] !== 'end') return Server.eBroadcast('That is NOT a dimension you can teleport to!', chatmsg.sender.name, 'DIMS');
    const X = !isNaN(parseInt(args[1])) ? parseInt(args[1]) : chatmsg.sender.location.x,
        Y =  !isNaN(parseInt(args[2])) ? parseInt(args[2]) : chatmsg.sender.location.y,
        Z = !isNaN(parseInt(args[3])) ? parseInt(args[3]) : chatmsg.sender.location.z;
    Server.player.fetch(player).teleport(new Location(X, Y, Z), world.getDimension(args[0] === 'end' ? 'the end' : args[0]), 0, 0);
    Server.broadcast(`You have been teleported to the dimension §4${args[0] === 'end' ? 'The End' : args[0]}§7 at §c${~~X}§7, §c${~~Y}§7, §c${~~Z}§7! `, chatmsg.sender.name, 'DIMS');
});
Server.command.register({
    cancelMessage: true,
    name: 'dimensiont',
    description: `Toggles ${Server.lang.prefix}dimension so people can use ${Server.lang.prefix}dimension how you set it to!`,
    aliases: ['dimtoggle', 'dim-toggle', 'dimt'],
    category: 'Miscellanous',
    admin: true,
    documentation: {
        usage: 'dimt',
        examples: [
            'dimt'
        ],
        developers: ['Mo9ses']
    }
}, chatmsg => Server.basicCommandToggle('dimension', chatmsg.sender.name));
