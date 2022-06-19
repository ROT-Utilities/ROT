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
    name: 'text',
    description: 'Makes a cool little floating text so you don\'t have to place signs everywhere!',
    aliases: ['t', 'floating-text'],
    category: 'Building',
    admin: true,
    documentation: {
        usage: 'text <text?>',
        information: 'This command will summon a invisiable floating entity (A rabbit) that cannot be killed OUT using commands nor can it move with what you typed after the command.',
        examples: [
            'text Welcome to my eypc Minecraft server!',
            'text Plz donate, I\'m homeless!',
            'text Shop up ahead /\\!'
        ],
        developers: ['Mo9ses', 'notbeer']
    }
}, (chatmsg, args) => {
    Server.broadcast(`Creating floating text...\nCreated floating text "§c${args.join(' ')}§r§7"!`, chatmsg.sender.name, 'TEXT');
    if(args.join(' ').includes('"')) Server.eBroadcast('The text may not include a §4"§c', chatmsg.sender.name, 'TEXT');
    Server.runCommand(`execute "${chatmsg.sender.name}" ~~~ summon rabbit "${args.join(' ')}" ~~~`);
});
Server.command.register({
    cancelMessage: true,
    name: 'killtext',
    description: 'This command will kill floating in a radius of your player',
    aliases: ['killfloating-text', 'kill-floating-text', 'kilt'],
    category: 'Building',
    admin: true,
    documentation: {
        usage: 'killtext <radius?>',
        information: 'This command will floating text in a radius of your player',
        examples: [
            'killtext 1',
            'killtext 5',
            'killtext 1.2',
            'killtext'
        ],
        developers: ['Mo9ses', 'notbeer']
    }
}, (chatmsg, args) => {
    if(args[0]) {
        var radius = parseInt(args[0]);
        if(isNaN(radius)) return Server.eBroadcast('Please type in numbers or type in nothing!', chatmsg.sender.name, 'KILL TEXT');
    } else radius = 1;
    Server.broadcast(`Killing all floating text in the radius of §c${radius}§7 blocks from your current loction!`, chatmsg.sender.name, 'KILL TEXT');
    Server.runCommand(`execute "${chatmsg.sender.name}" ~~~ kill @e[type=rabbit,r=${radius},tag=!ROTLB]`);
});