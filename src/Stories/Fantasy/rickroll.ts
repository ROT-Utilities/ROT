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
    name: 'rickroll',
    description: 'Use this command to piss off other members :)',
    category: 'Fantasy',
    admin: true,
    documentation: {
        usage: 'rickroll <player?>',
        information: 'Why?',
        examples: [
            'rickroll Mo9ses'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    let player;
    if(args[0]) {
        player = args.join(' ');
        if(!Server.player.find(player)) return Server.eBroadcast(Server.lang.playerDoesNOTexist, chatmsg.sender.name, 'RICKROLL');
    }
    Server.broadcast(`§aNever gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\nNever gonna make you cry\nNever gonna say goodbye\nNever gonna tell a lie and hurt you\nRickroll requested by §c${chatmsg.sender.name}§7!`, player ? player : '@a', 'ROT');
});