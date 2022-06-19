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
    name: 'vanish',
    description: `When you type ${Server.lang.prefix}vanish in chat... You'll vanish!`,
    aliases: ['v', 'van', 'disappear', 'yourdad', 'is...', 'gone', 'lol'],
    category: 'Escape',
    admin: true,
    documentation: {
        usage: 'vanish <player?>',
        information: 'This command will make you invisible so you cannot be seen by other players! This command is useful for "trolling"',
        examples: [
            'v',
            'van YourDad',
            'vanish',
            'vanish SomeGuyWhoIsNotOP',
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if(args[0]) {
        if(!Server.player.find(args.join(' '))) return Server.eBroadcast(Server.lang.playerDoesNOTexist, chatmsg.sender.name, 'VANISH');
        var player = args.join(' ');
    } else player = chatmsg.sender.name;
    if(!Server.player.findTag('vanish', player)) {
        Server.runCommands([
            `tag "${player}" remove unvanish`,
            `tag "${player}" add vanish`,
            `effect "${player}" invisibility 100000 255 true`,
            `effect "${player}" night_vision 100000 255 true`,
            `event entity "${player}" rot:vanish`
        ]);
        return Server.broadcast(Server.lang.v1, chatmsg.sender.name, 'VANISH');
    }
    Server.runCommands([
        `event entity "${player}" rot:unvanish`,
        `tag "${player}" add dvvanish`,
        `effect "${player}" invisibility 0`,
        `effect "${player}" night_vision 0`,
        `tag "${player}" remove vanish`,
        `tag "${player}" add unvanish`,
        `tag "${player}" remove dvvanish`
    ]);
    Server.broadcast(Server.lang.v2, chatmsg.sender.name, 'VANISH');
});