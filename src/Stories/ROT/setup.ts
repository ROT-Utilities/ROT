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
    name: 'setup',
    description: 'This command will be one your first command to the EPIC adventure of ROT!',
    category: 'ROT',
    admin: true,
    documentation: {
        usage: 'setup',
        information: 'This command will setup ROT and everything it needed for it to run properly.',
        examples: [
            'setup'
        ],
        developers: ['Mo9ses']
    }
}, chatmsg => {
    if(!Server.player.find(chatmsg.sender.name)) return;
    if(!Server.player.isAdmin(chatmsg.sender.name)) return Server.eBroadcast(Server.lang.error, chatmsg.sender.name, 'ROT');
    if(Server.settings.getScore('ROT') === 1) return Server.eBroadcast(Server.lang.setupError, chatmsg.sender.name, 'Server');
    Server.broadcast(Server.lang.setups, chatmsg.sender.name, 'ROT Setup');
    Server.runCommands([
        'gamerule sendcommandfeedback false',
        'gamerule commandblockoutput false'
    ]);
    Server.settings.setScore('kickTime', 300);
    Server.settings.setScore('ROT', 1);
    Server.settings.setScore('ID', ~~(Math.random() * (100000 - 10000) - 1000));
});