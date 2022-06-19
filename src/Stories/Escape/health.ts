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
    name: 'health',
    description: `Makes it so you can see people's health below their gamertag`,
    aliases: ['healtht', 'hearts', 'heart', '<3'],
    category: 'Escape',
    admin: true,
    documentation: {
        usage: 'health',
        information: 'This command will setdisplay the scoreboard "ROTh" below everyboy\'s gamertag.',
        examples: [
            'health'
        ],
        developers: ['Mo9ses']
    }
}, chatmsg => {
    if(!Server.settings.getScore('health')) Server.settings.set('health', 0);
    if(Server.settings.getScore('health') === 0) { 
        Server.settings.setScore('health', 1);
        return Server.broadcast('Members can now see other player\'s health underneath their gamertag!', chatmsg.sender.name, 'Health');
    }
    Server.settings.setScore('health', 0);
    Server.runCommand('scoreboard objectives setdisplay belowname');
    Server.broadcast('Members can no longer see other player\'s health underneath their gamertag :(', chatmsg.sender.name, 'Health');
});