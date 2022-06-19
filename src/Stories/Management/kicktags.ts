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
    name: 'kicktags',
    description: 'This command will kick any players from the game with a certain tag ',
    aliases: ['ktags', 'ktag', 'kicktag'],
    category: 'Managemeant',
    admin: true,
    documentation: {
        usage: 'ktag <toggle|set|reverse|message> <tag|text>',
        information: 'Enabling this automatically kick players from with the tag "§ckick§5" or whatever you set it to except verified admins :). Reverse will make it so it will kick everyone that doesn\'t have the tag except verified admins.',
        examples: [
            'ktags set pro',
            'ktag toggle',
            'kicktags reverse',
            'ktag msg Only pros allowed!'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    const toggle = ['toggle','t','off','on','switch','state'], set = ['make','set','let','to'], reverse = ['reverse','backwords','back','words','backword','other-way','other'], msg = ['msg','message','mess','text','reason','reasons'];
    if(toggle.includes(args[0])) {
        if(Server.settings.getScore('KTT')) Server.settings.setScore('KTT', 0); else Server.settings.setScore('KTT', 1);
        return Server.broadcast(`Kick tags is now §c${Server.settings.getScore('KTT') ?  'on' : 'off'}§7!`, chatmsg.sender.name, 'KICK TAGS');
    }
    if(set.includes(args[0])) {
        let tag = args.slice(1).join(' ');
        Server.settings.set('KTTag', tag);
        return Server.broadcast(`The ROT's kick tag is now "§c${tag}§r§7"!`, chatmsg.sender.name, 'KICK TAGS');
    }
    if(reverse.includes(args[0])) {
        if(Server.settings.getScore('KTR')) Server.settings.setScore('KTR', 0); else Server.settings.setScore('KTR', 1);
        return Server.broadcast(`Reversed kick tags is now §c${Server.settings.getScore('KTR') ? 'on' : 'off'}§7!`, chatmsg.sender.name,'KICK TAGS');
    }
    if(msg.includes(args[0])) {
        let reason = args.slice(1).join(' ');
        Server.settings.set('KTMsg', reason);
        return Server.broadcast(`The new kick message is now "§c${reason}§r§7"!`, chatmsg.sender.name,'KICK TAGS');
    }
    Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'KICK TAGS');
});