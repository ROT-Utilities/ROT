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
    name: 'prefix',
    description: `This will change ROT\'s prefix from §c${Server.lang.prefix}§5 to whatever you set it to.`,
    category: 'ROT',
    admin: true,
    documentation: {
        usage: 'prefix <prefix>',
        information: 'This will change the prefix for ROT commands for everybody in the server.',
        examples: [
            'prefix +',
            'prefix $',
            'prefix Boi,What,Da,Hell,Boi?'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if(!args[0]) Server.eBroadcast('The command prefix cannot be nothing...', chatmsg.sender.name, 'PREFIX');
    if(args[1]) Server.eBroadcast('You cannot have spaces in your command prefixes!', chatmsg.sender.name, 'PREFIX');
    if(args[0].startsWith('/')) return Server.eBroadcast(`Your prefix may not contain a "§7/§c"!`, chatmsg.sender.name, 'PREFIX');
    Server.broadcast(`§c${chatmsg.sender.name}§7 has changed the server prefix to "§4§l${args[0]}§r§7"! The server needs to restart in order to start using the new prefix.`, '@a', 'ROT');
    Server.settings.set('prefix', args[0]);
});