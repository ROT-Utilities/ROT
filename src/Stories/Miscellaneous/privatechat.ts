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
    name: 'pc',
    description: 'Use this to chat privately with your friends',
    aliases: ['privatechat', 'private-chat', 'private', 'private-parts', 'dm'],
    category: 'Miscellaneous',
    documentation: {
        usage: 'pc <join|leave|invite> <number?|player?>',
        information: 'This command will give the use a scoreboard score of what number they type in. The score will determine what chat you will be in. The max is 10000',
        examples: [
            'pc join 92',
            'privatechat join 2',
            'private leave',
            'private-chat invite Mo9ses',
            'private-parts invite Booba'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    let join = ['join','partof','welcoome','join','go'], leave = ['leave','left','jumpship','exit'], inv = ['inv','invite','add','ask'];
    if(join.includes(args[0])){
        if(Server.player.getScore('ROTPrivateChat', chatmsg.sender.name) !== 0) return Server.eBroadcast(`You have to leave private chat §4${Server.player.getScore('ROTPrivateChat', chatmsg.sender.name)}§c first! Do so by typing "§7!pc leave§c" in chat.`, 'Private Chat');
        if(!args[1] || !parseInt(args[1])) return Server.eBroadcast('Type a Private chat number/id!', chatmsg.sender.name, 'Private Chat');
        if(parseInt(args[1]) < 1 || parseInt(args[1]) > 10000) return Server.eBroadcast('That is an invalid number!', chatmsg.sender.name, 'Private Chat');
        Server.runCommand(`scoreboard players set "${chatmsg.sender.name}" ROTPrivateChat ` + args[1]);
        return Server.broadcast(`§c${chatmsg.sender.name}§7 has §a§lJOINED§r§7 the private chat!`, `@a[scores={ROTPrivateChat=${Server.player.getScore('ROTPrivateChat', chatmsg.sender.name)}}]`, 'Private Chat');
    }
    if(leave.includes(args[0])) {
        if(Server.player.getScore('ROTPrivateChat', chatmsg.sender.name) === 0) return Server.eBroadcast('Your not even in a private chat! Join one by typing "§7!pc join <number>§c" in chat.', chatmsg.sender.name, 'Private Chat');
        Server.broadcast(`You have §a§lLEFT§r§7 private chat session §c${Server.player.getScore('ROTPrivateChat', chatmsg.sender.name)}§7 and §e§lRECONNECTED§r§7 back to the §a§lGLOBAL§r§7 chat!`, chatmsg.sender.name, 'Private Chat');
        Server.runCommand(`scoreboard players reset "${chatmsg.sender.name}" ROTPrivateChat`);
        return Server.broadcast(`§c${chatmsg.sender.name}§7 has §c§lLEFT§r§7 the private chat!`, `@a[scores={ROTPrivateChat=${Server.player.getScore('ROTPrivateChat', chatmsg.sender.name)}}]`, 'Private Chat');
    }
    if(inv.includes(args[0])) {
        if(Server.player.getScore('ROTPrivateChat', chatmsg.sender.name) === 0) return Server.eBroadcast('Your not even in a private chat! Join one by typing "§7!pc join <number>§c" in chat.', chatmsg.sender.name, 'Private Chat');
        if(!args[1]) return Server.eBroadcast('You need to type a member\'s name/gamertag.', chatmsg.sender.name, 'Private Chat');
        const player = args.slice(1).join(' ');
        if(player === chatmsg.sender.name) return Server.eBroadcast('You cannot invite yourself Mr. No Valentine!', chatmsg.sender.name, 'Private Chat');
        if(!Server.player.find(player)) return Server.eBroadcast(Server.lang.playerDoesNOTexist, chatmsg.sender.name, 'Private Chat');
        if(Server.player.getScore('ROTPrivateChat', player) === Server.player.getScore('ROTPrivateChat', chatmsg.sender.name)) return Server.eBroadcast(`§4${player}§c is already in this private chat session!`, chatmsg.sender.name, 'Private Chat');
        Server.broadcast(`You have been invited to private chat session §c${Server.player.getScore('ROTPrivateChat', chatmsg.sender.name)}§7 by §4${chatmsg.sender.name}§7! You can join by typing "§6!pc join ${Server.player.getScore('ROTPrivateChat', chatmsg.sender.name)}§7" in chat.`, player, 'Private Chat');
        return Server.broadcast(`You invited §c${player}§7 to your private chat session!`, chatmsg.sender.name, 'Private Chat');
    }
    Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'Private Chat');
});