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
    name: 'afk',
    description: 'This command will help manage afk players!',
    category: 'Managemeant',
    admin: true,
    documentation: {
        usage: 'afk <time|on/off> <seconds?>',
        information: 'Which ever member is not active for a amount of time will be kick out of the server. You are able to adjust the time yes.',
        examples: [
            'afk on',
            'afk time 5000'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    const toggle = ['toggle', 'on', 'off', 'enable'], time = ['time', 'length', 'amount']
    if(toggle.includes(args[0])) {
        if(Server.settings.getScore('AFK') !== 1) Server.settings.setScore('AFK', 1); else Server.settings.setScore('AFK', 0)
        return Server.broadcast(`The AFK system is now §c${Server.settings.getScore('AFK') !== 1 ? 'off' : 'on'}§7!`, chatmsg.sender.name, 'AFK');
    }
    if(time.includes(args[0])) {
        if(!args[1]) return Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'AFK');
        let number = parseInt(args[1]);
        if(!number) return Server.eBroadcast('Please type a number!', chatmsg.sender.name, 'AFK');
        if(number < 100) return Server.eBroadcast('That number is too small!', chatmsg.sender.name, 'AFK');
        Server.runCommand('scoreboard players set kickTime ROTDatabase ' + number);
        return Server.broadcast(`The AFK time has been set to §c${number}§7!`, chatmsg.sender.name, 'AFK');
    }
    Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'AFK');
});