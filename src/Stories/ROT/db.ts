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
import { DatabasePaper } from '../../Papers/DatabasePaper.js';
Server.command.register({
    cancelMessage: true,
    name: 'db',
    description: 'Let\'s you talk directly to ROT\'s Database system',
    aliases: ['data', 'database', 'dbs'],
    category: 'ROT',
    admin: true,
    documentation: {
        usage: 'db <table> <write|fetch|has|delete|clear|keys|values|collection|setScore|getScore> <key> <value?> <memory key>',
        information: 'This command will find and return information about the current version of ROT installed.',
        examples: [
            'db <table> write <key> <value> <true|false>',
            'db <table> fetch <key>',
            'db <table> has <key>',
            'db <table> delete <key>',
            'db <table> clear',
            'db <table> keys',
            'db <table> value',
            'db <table> collection'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if(!args[0]) return Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'DB');
    if(args[0].replace(/[a-zA-Z0-9]/g, '') !== '') Server.eBroadcast('You may only use letters for the table name.', chatmsg.sender.name, 'DB');
    const db = new DatabasePaper(args[0]),
    write = ['write', 'set', 's'],
    fetch = ['fetch', 'get', 'pull', 'f', 'g', 'read', 'r'],
    has = ['has', 'find', 'h'], 
    del = ['delete', 'del', 'remove'],
    clear = ['clear', 'wipe'],
    collection = ['collection', 'collect', 'col', 'c'],
    setScore = ['setscore', 'ss'],
    getScore = ['getscore', 'gs', 'gg'];
    if(write.includes(args[1])) {
        if(!args[2]||!args[3]) return Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'DB');
        let value = args.slice(3);
        if(args.slice(-1).toString() === 'true') value.splice(-1, 1);
        db.set(args[2], value.join(' '), args.slice(-1).toString() === 'true');
        return Server.broadcast(`§c${args[2]}§7's value has been set to "§4${value.join(' ')}§7"!`, chatmsg.sender.name, 'DB');
    }
    if(fetch.includes(args[1])) {
        if(!args[2]) return Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'DB');
        return Server.broadcast(`§c${args.slice(2).join(' ')}§7's value is "§4${JSON.stringify(db.get(args.slice(2).join(' ')))}§r§7"!`, chatmsg.sender.name, 'DB');
    }
    if(has.includes(args[1])) {
        if(!args[2]) return Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'DB');
        return Server.broadcast(`The server does §l${db.has(args.slice(2).join(' ')) ? '§aINDEED' : '§4NOT'}§7 have a key with the name "§c${args[2]}§7"!`, chatmsg.sender.name, 'DB');
    }
    if(del.includes(args[1])) {
        if(!args[2]) return Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'DB');
        if(!db.has(args.slice(2).join(' '))) return Server.eBroadcast(`The table §7${args[0]}§c doesn't have any key by the name of §4${args.slice(3).join(' ')}§7...`, chatmsg.sender.name, 'db');
        db.delete(args.slice(2).join(' '));
        return Server.broadcast(`The key §c${args.slice(2).join(' ')}§7 has been wiped off of the database table §6${args[0]}§7!`, chatmsg.sender.name, 'DB');
    }
    if(clear.includes(args[1])) return Server.broadcast(`The database table "§c${args[0]}§7" and all of it's keys and values has been cleared!`, chatmsg.sender.name, 'DB'), db.clear();
    if(args[1] === 'keys') return Server.broadcast(`Here is all the memory keys from the table "§c${args[0]}§7"\n§c` + db.allKeys()?.join('§r\n§c'), chatmsg.sender.name, 'DB');
    if(args[1] === 'values') return Server.broadcast(`Here is all of the values from all the memory keys from the table "§c${args[0]}§7"\n§c` + db.allValues()?.map(value => {return JSON.stringify(value)}).join('§r\n§c'), chatmsg.sender.name, 'DB');
    if(collection.includes(args[1])) return Server.broadcast(`Here is a collection of all the memory keys and thier corresponding memory value from the table "§c${args[0]}§7"\n§c` + JSON.stringify(db.getCollection()), chatmsg.sender.name, 'DB');
    if(setScore.includes(args[1])) {
        if(!args[2]||!args[3]) return Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'DB');
        if(isNaN(parseInt(args[3])))  return Server.eBroadcast('That is not a number!', chatmsg.sender.name, 'DB');
        db.setScore(args[2], parseInt(args[3]));
        return Server.broadcast(`§c${args[2]}§7's value has been set to "§4${args[3]}§7"!`, chatmsg.sender.name, 'DB');
    }
    if(getScore.includes(args[1])) {
        if(!args[2]) return Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'DB');
        return Server.broadcast(`§c${args[2]}§7's value is "§4${db.getScore(args[2]) ?? undefined}§7"!`, chatmsg.sender.name, 'DB');
    }
    return Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'DB');
});