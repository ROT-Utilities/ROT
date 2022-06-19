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
    name: 'timeout',
    description: 'This command will render the member you wish incapable of even breathing',
    aliases: ['to'],
    category: 'Managemeant',
    admin: true,
    documentation: {
        usage: 'timeout <player?>',
        examples: [
            'timeout notbeer',
            'timeout moisesgamingtv9'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if(args[0]) return Server.eBroadcast('Type a player name!', chatmsg.sender.name, 'Timeout');
    const player = args.join(' ');
    if(!Server.player.find(player)) return Server.eBroadcast(Server.lang.playerDoesNOTexist, chatmsg.sender.name, 'Timeout');
    if(player === chatmsg.sender.name) return Server.eBroadcast('You timeout ban yourself cuh', chatmsg.sender.name, 'Timeout');
    if(Server.player.isAdmin(player)) return Server.eBroadcast('You may not timeout a staff member!', chatmsg.sender.name, 'Timeout');
    if(Server.player.findTag('ROTTimeout', player)) {
        Server.runCommand(`tag "${player}" remove ROTTimeout`);
        return Server.broadcast(`§c${player}§7 has been removed from timeout!`, chatmsg.sender.name, 'Timeout');
    }
    Server.runCommand(`tag "${player}" add ROTTimeout`);
    Server.broadcast(`§c${player}§7 has been added to timeout!`, chatmsg.sender.name, 'Timeout');
});