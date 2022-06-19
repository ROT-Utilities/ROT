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
import { EntityQueryOptions, Location, world } from 'mojang-minecraft';
Server.command.register({
    cancelMessage: true,
    name: 'leaderboard',
    description: 'This is the command everyone has been waiting for(Not Really), LEADERBOARDS',
    aliases: ['lb','leadb','lead','board','leader','l','b'],
    category: 'Building',
    admin: true,
    documentation: {
        usage: 'leaderboard <create|remove|set> <objective|length|header>',
        information: 'This command will summon an invisable floating text entity (A glorified rabbit) and set it\'s text to a leaderboard format',
        examples: [
            'lb create money',
            'lb create money money2',
            'lb remove',
            'lb set length 5',
            'lb set header Cool money leaderboard'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    const create = ['create', 'make', 'add', 'c-'], remove = ['del', 'delete', 'rev', 'remove', 'r', 'r-'], set = ['set', 's', 'put'];
    if(create.includes(args[0])) {
        if(!args[1]) return Server.eBroadcast('You need to type something!', chatmsg.sender.name, 'LEADERBOARD');
        Server.runCommands([
            `execute "${chatmsg.sender.name}" ~~~ execute @e[type=rabbit,r=4,tag=ROTLB] ~~~ tp @s ^^^2 facing "${chatmsg.sender.name}"`,
            'summon rabbit ' + Math.trunc(chatmsg.sender.location.x) + ' ' + Math.trunc(chatmsg.sender.location.y) + ' ' + Math.trunc(chatmsg.sender.location.z),
            `execute "${chatmsg.sender.name}" ~~~ tag @e[type=rabbit,r=2] add ROTLB`,
            `execute "${chatmsg.sender.name}" ~~~ tag @e[type=rabbit,r=2] add "ROTLBL:5"`,
            `execute "${chatmsg.sender.name}" ~~~ tag @e[type=rabbit,r=2] add "ROTLBD:${args[1]}"`,
            `scoreboard objectives add ${args[1]} dummy`
        ]);
        return Server.broadcast(`Successfully created a leaderboard displaying the objective "§c${args[1]}§r§7"!`, chatmsg.sender.name, 'LEADERBAORD');
    }
    if(remove.includes(args[0])) {
        const options = new EntityQueryOptions();
        options.type = "minecraft:rabbit";
        options.tags = ['ROTLB'];
        options.closest = 2;
        options.location = new Location(chatmsg.sender.location.x, chatmsg.sender.location.y, chatmsg.sender.location.z);
        for(const dim of ['overworld', 'nether', 'the end']) {
            let entities = world.getDimension(dim).getEntities(options) ?? undefined;
            if(entities) for(const entity of entities) {
                Server.broadcast(`Successfully deleted a near by leaderboard displaying the objective "§c${entity.getTags().filter(tag => tag.startsWith('ROTLBD:'))[0].replace('ROTLBD:', '')}§r§7"!`, chatmsg.sender.name, 'LEADERBAORD');
                return entity.kill();
            }
        }
        return Server.eBroadcast('Unable to find and delete a leaderboard in the radius of §42§c blocks. Maybe move a bit closer?', chatmsg.sender.name, 'LEADERBOARD');
    }
    if(set.includes(args[0])) {
        const options = new EntityQueryOptions();
        options.type = "minecraft:rabbit";
        options.tags = ['ROTLB'];
        options.location = new Location(chatmsg.sender.location.x, chatmsg.sender.location.y, chatmsg.sender.location.z);
        for(const dim of ['overworld', 'nether', 'the end']) {
            let entities = world.getDimension(dim).getEntities(options) ?? undefined;
            if(entities) for(const lb of entities) {
                const head = ['header', 'head', 'title', 'top', 'h'], length = ['length', 'long', 'max', 'players', 'l', 'm'];
                if(head.includes(args[1])) {
                    lb.getTags().filter(tag => tag.startsWith('ROTLBH:') ? lb.removeTag(tag) : null);
                    if(!args[2]) return Server.broadcast('The header of your leader has now been set the defualt!', chatmsg.sender.name, 'LEADERBAORD');
                    lb.addTag('ROTLBH:' + args.slice(2).join(' ') + '\n');
                    return Server.broadcast(`The header of your leaderboard has now been set to "§c${args.slice(2).join(' ')}§r§7"!`, chatmsg.sender.name, 'LEADERBAORD');
                }
                if(length.includes(args[1])) {
                    if(isNaN(parseInt(args[2]))) Server.eBroadcast(`Please type a number!`);
                    if(parseInt(args[2]) >= 30) return Server.eBroadcast('The length of the leaderboard my not be longer than §430§c members!', chatmsg.sender.name, 'LEADERBAORD');
                    //Thanks to MaRa Games for finding this bug
                    if(parseInt(args[2]) <= 0) return Server.eBroadcast('The length of the leaderboard my not be less than §41§c!', chatmsg.sender.name, 'LEADERBAORD');
                    lb.getTags().filter(tag => tag.startsWith('ROTLBL:') ? lb.removeTag(tag) : null);
                    lb.addTag('ROTLBL:' + args[2]);
                    return Server.broadcast(`The max length for your leaderboard is now §c${args[2]}§7 players!`, chatmsg.sender.name, 'LEADERBOARD');
                }
                return Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'LEADERBOARD');
            } return Server.eBroadcast('Unable to find and edit a leaderboard in the radius of §42§c blocks. Maybe move a bit closer?', chatmsg.sender.name, 'LEADERBOARD');
        }
    }
    Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'LEADERBOARD');
});