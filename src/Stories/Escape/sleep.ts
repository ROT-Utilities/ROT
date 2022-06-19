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
    name: 'sleep',
    description: 'Enabling this makes it so only one player is required to sleep in a bed to skip the night',
    aliases: ['sleept'],
    category: 'Escape',
    admin: true,
    documentation: {
        usage: 'sleep',
        information: 'Enabling this makes it so only one player is required to sleep in a bed to skip the night',
        examples: [
            'sleept'
        ],
        developers: ['Mo9ses']
    }
}, chatmsg => {
    if(!Server.settings.getScore('sleep')) Server.settings.setScore('sleep', 0);
    if(Server.settings.getScore('sleep') === 0) {
        Server.settings.setScore('sleep', 1);
        return Server.broadcast('Only §c1§7 player is required to skip the night now!', chatmsg.sender.name, 'SLEEP');
    }
    Server.settings.setScore('sleep', 0);
    Server.broadcast('All players are required to skip the night now.', chatmsg.sender.name, 'Death Bed');
});