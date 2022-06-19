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
    name: 'clearchat',
    description: 'This command will clear the chat.',
    aliases: ['chatc', 'bomb', 'nochat','hidechat', 'clear'],
    category: 'Server',
    admin: true,
    documentation: {
        usage: 'clearchat',
        information: 'This command will spam the chat with just nothing until chat is cleared',
        examples: [
            'chatclear'
        ],
        developers: ['Mo9ses']
    }
}, chatmsg => {
    let space = '  ';
    for(let i = 0; i < 100; i++) Server.broadcast(space.repeat(100), '@a', '', false);
    Server.broadcast(`The chat has been cleared by §c${chatmsg.sender.name}§r§7!`, '@a', 'ROT');
});