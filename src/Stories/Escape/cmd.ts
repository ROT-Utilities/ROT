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
    name: 'cmd',
    aliases: ['command', 'command-run', 'execute-command'],
    description: 'This command will execute a normal Minecraft command for you',
    category: 'Escape',
    admin: true,
    documentation: {
        usage: 'cmd <command>',
        examples: [
            'cmd kill @a',
            'cmd say hi',
        ],
        notes: 'This command is pretty useless...',
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if(!args[0]) return Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'CMD');
    Server.broadcast(Server.runCommand(`execute "${chatmsg.sender.name}" ~~~ ${args.join(' ')}`).statusMessage, chatmsg.sender.name, 'CMD');
});