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
        name: 'broadcast',
        description: 'Broadcast a message to the entire server',
        aliases: ['b', 'bc', 'cast', 'console', 'bbcnews'],
        category: 'Server',
        admin: true,
        documentation: {
                usage: 'broadcast <message>',
                information: 'This command will send a message to everyone in the server.',
                examples: [
                        'broadcast The server will be closing soon!',
                        'broadcast The hacker has been banned!'
                ],
                developers: ['Mo9ses']
        }
}, (chatmsg, args) => {
        if(!args[0]) return Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'Broadcast'); Server.broadcast(args.join(' '));
});