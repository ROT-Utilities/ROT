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
    name: 'timezone',
    description: 'This just sets the timezone in the chat to your time :)',
    aliases: ['tz'],
    category: 'Miscellaneous',
    documentation: {
        usage: 'timezone <number>',
        examples: [
            'timezone 2',
            'timezone -4',
            'tz -6',
            'tz +5'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if(isNaN(parseInt(args[0])) || parseInt(args[0]) >= 24 || parseInt(args[0]) <= -24) return Server.eBroadcast('That is not a number!', chatmsg.sender.name, 'Timezone');
    Server.runCommand(`scoreboard players set "${chatmsg.sender.name}" ROTTimezone ` + args[0]);
    Server.broadcast(`Your timezone has been set to §4§l${parseInt(args[0]) >= 0 ? '+' + args[0] : args[0]}§r§7 hours!`, chatmsg.sender.name, 'Timezone');
});