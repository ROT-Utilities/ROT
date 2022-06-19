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
import { DatabasePaper } from '../../Papers/DatabasePaper.js';
import Server from '../../ServerBook.js';
Server.command.register({
    cancelMessage: true,
    name: 'reset',
    description: 'This command will reset this server\'s current ROT settings.',
    category: 'ROT',
    admin: true,
    documentation: {
        usage: 'reset',
        information: 'This command will reset every ROT setting. Only ranks won\'t be reset.',
        examples: [
            'reset'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if(!args[0]) return Server.broadcast(`§4You need to type your ROT ID (§a§l${Server.settings.getScore('ID')}§r§4) and the command like this "§7${Server.lang.prefix}reset ${Server.settings.getScore('ID')}§4" to be able to reset ROT!`, chatmsg.sender.name, 'ROT');
    const code = parseInt(args.join(' '));
    if(Server.settings.getScore('ID') === code) {
        Server.broadcast('§l§cNOOOO... YOU WON\'T BE ABLE TO TAKE ME ALIVE! N-N-NOO', '@a', 'ROT');
        Server.broadcast('Please restart the server or ROT won\'t work for a while (A very long time)', chatmsg.sender.name, '§6Mo9ses');
        new DatabasePaper('Wrps').clear();
        new DatabasePaper('rottle').clear();
        new DatabasePaper('REG').clear();
        new DatabasePaper('PL').clear();
        Server.bans.clear();
        Server.mutes.clear();
        Server.sc.clear();
        Server.tpa.clear();
        Server.settings.clear();
        return Server.runCommands([
            'scoreboard objectives remove ROTplayerID',
            'scoreboard objectives remove ROTplayerID2',
            'scoreboard objectives remove ROTplayerUUID',
            'scoreboard objectives remove ROTstolen',
            'scoreboard objectives remove ROTnftj',
            'scoreboard objectives remove ROTCommandTimeout',
            'scoreboard objectives remove ROTh',
            'scoreboard objectives remove ROThomeX',
            'scoreboard objectives remove ROThomeY',
            'scoreboard objectives remove ROThomeZ',
            'scoreboard objectives remove ROThome',
            'scoreboard objectives remove ROTseconds',
            'scoreboard objectives remove ROTafk',
            'scoreboard objectives remove ROTMessageMute',
            'scoreboard objectives remove ROTTPA1',
            'scoreboard objectives remove ROTTPA2',
            'scoreboard objectives remove ROTTPA3',
            'scoreboard objectives remove ROTseconds',
            'scoreboard objectives remove ROTminutes',
            'scoreboard objectives remove ROThours',
            'scoreboard objectives remove ROTland',
            'scoreboard objectives remove ROTlandp',
            'scoreboard objectives remove ROTlandID',
            'scoreboard objectives remove ROTlandX',
            'scoreboard objectives remove ROTlandY',
            'scoreboard objectives remove ROTlandZ',
            'scoreboard objectives remove ROTlandAmount',
            'scoreboard objectives remove ROTLBL',
            'scoreboard objectives remove ROTLBID',
            'scoreboard objectives remove ROTLBx',
            'scoreboard objectives remove ROTLBy',
            'scoreboard objectives remove ROTLBz',
            'scoreboard objectives remove ROTPrivateChat'
        ]);
    }
    Server.eBroadcast('The code you typed is incorrect!', chatmsg.sender.name, 'ROT');
    return Server.broadcast(`§4You need to type your ROT ID (§a§l${Server.settings.getScore('ID')}§r§4) and the command like this "§7${Server.lang.prefix}reset ${Server.settings.getScore('ID')}§4" to be able to reset ROT!`, chatmsg.sender.name, 'ROT');
});