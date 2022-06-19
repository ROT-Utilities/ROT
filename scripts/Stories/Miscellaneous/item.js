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
import { world } from 'mojang-minecraft';
import Server from '../../ServerBook.js';
import config from '../../config.js';
import { DatabasePaper } from '../../Papers/DatabasePaper.js';
const click = new DatabasePaper('ITM');
config.click && Server.command.register({
    cancelMessage: true,
    name: 'click',
    description: 'Detects when a player clicks or punches with an item and runs a Minecraft command',
    aliases: ['cli', 'hit', 'use', 'cl'],
    category: 'Miscellaneous',
    documentation: {
        usage: 'click <set|list|remove> <item?> <click?|punch?|sync?> <minecraft command>',
        information: 'Use this command to test when a player punches or clicks and run a Minecraft command bassed on which action they did. Sync basically makes the punch and hit run the same command',
        examples: [
            'click set minecraft:stick click say hi',
            'click set minecraft:stick punch kill @s',
            'click set minecraft:stick sync say this will make both punch and kill run the same command',
            'click list',
            'click remove minecraft:stick'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    const set = ['set', 'push', 'put'], list = ['list', 'all', 'tell', 'info', 'information', 'data', 'intel'], del = ['del', 'delete', 'remove', 'yeet', 'r'];
    if (!args.length || list.includes(args[0])) {
        const allItems = click.allKeys()?.map(itm => {
            const itemData = click.get(itm);
            return `§aItem ID: §4§l${itm}§r\n §aClick Command: §c${itemData?.c}§r\n §aPunch Command: §c${itemData?.p}§r`;
        });
        return Server.broadcast(`There are a total of §c${allItems.length}§7 item events. Here is all their info:\n` + allItems.join('\n'), chatmsg.sender.name, 'Click');
    }
    if (!args[1] || !args[1].includes(':') || args[1].replace(/[a-zA-Z0-9]:?/g, '') !== '')
        return Server.eBroadcast('Type a item ID "insert skull emoji here".', chatmsg.sender.name, 'click');
    const place = ['c', 'click', 'cli', 'cl', 'u', 'use', 'us', 'place', 'plc', 'pl'], hit = ['p', 'pun', 'punch', 'h', 'hit'], sync = ['s', 'sync', 'sy', 'same', 'both'];
    if (set.includes(args[0])) {
        if (!args[2] || !args[3])
            return Server.eBroadcast(`You need to type a command you want this action to run. If you want to remove the item just do "§c!click remove <item>§7"`, chatmsg.sender.name, 'click');
        if (place.includes(args[2])) {
            click.set(args[1], Object.assign(click.get(args[1]) ?? {}, { c: args.slice(3).join(' ') }), true);
            return Server.broadcast(`The item "§c${args[1]}§7"'s click command has been set to "§a${args.slice(3).join(' ')}§r§7"!`, chatmsg.sender.name, 'click');
        }
        if (hit.includes(args[2])) {
            click.set(args[1], Object.assign(click.get(args[1]) ?? {}, { p: args.slice(3).join(' ') }), true);
            return Server.broadcast(`The item "§c${args[1]}§7"'s punch command has been set to "§a${args.slice(3).join(' ')}§r§7"!`, chatmsg.sender.name, 'click');
        }
        if (sync.includes(args[2])) {
            click.set(args[1], Object.assign(click.get(args[1]) ?? {}, { c: args.slice(3).join(' '), p: args.slice(3).join(' ') }), true);
            return Server.broadcast(`Both the commands (punch and click) for them item "§c${args[1]}§7" has been set to "§a${args.slice(3).join(' ')}§r§7"!`, chatmsg.sender.name, 'click');
        }
    }
    if (del.includes(args[0])) {
        if (!args[2] || sync.includes(args[2])) {
            click.delete(args[1]);
            return Server.broadcast(`The item "§c${args[1]}§7"'s click and punch commands have been §4§lDeleted!`, chatmsg.sender.name, 'click');
        }
        if (place.includes(args[2])) {
            const commands = click.get(args[1]);
            if (!commands.c)
                return Server.eBroadcast('The click command was never set!', chatmsg.sender.name, 'click');
            delete commands['c'];
            if (!commands.p)
                click.delete(args[1]);
            else
                click.set(args[1], commands);
            return Server.broadcast(`The item "§c${args[1]}§7"'s click command has been §4§lDeleted!`, chatmsg.sender.name, 'click');
        }
        if (hit.includes(args[2])) {
            const commands = click.get(args[1]);
            if (!commands.p)
                return Server.eBroadcast('The hit command was never set!', chatmsg.sender.name, 'click');
            delete commands['p'];
            if (!commands.c)
                click.delete(args[1]);
            else
                click.set(args[1], commands);
            return Server.broadcast(`The item "§c${args[1]}§7"'s punch command has been §4§lDeleted!`, chatmsg.sender.name, 'click');
        }
    }
    Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'click');
});
//Click code
if (config.click) {
    world.events.beforeItemUse.subscribe(data => {
        if (!click.has(data.item.id))
            return;
        Server.runCommand(`execute "${data.source.nameTag}" ~~~ ${click.get(data.item.id)?.c ?? 'help'}`);
        data.cancel = true;
    });
    world.events.entityHit.subscribe(data => {
        // @ts-ignore
        const item = data.entity.getComponent('minecraft:inventory').container.getItem(data.entity.selectedSlot) ?? 0;
        if (!item || !click.has(item.id))
            return;
        Server.runCommand(`execute "${data.entity.nameTag}" ~~~ ${click.get(item.id)?.p ?? 'help'}`);
    });
    //Sub processes
    world.events.beforeItemUseOn.subscribe(data => {
        if (!click.has(data.item.id))
            return;
        data.cancel = true;
    });
    world.events.blockBreak.subscribe(data => {
        // @ts-ignore
        const item = data.player.getComponent('minecraft:inventory').container.getItem(data.player.selectedSlot) ?? 0;
        if (!item || !click.has(item.id))
            return;
        data.dimension.getBlock(data.block.location).setPermutation(data.brokenBlockPermutation.clone());
        Server.runCommand(`kill @e[type=minecraft:item,x=${data.block.x},y=${data.block.y},z=${data.block.z},r=2.5]`);
    });
}
//Lore command
config.lore && Server.command.register({
    cancelMessage: true,
    name: 'lore',
    description: 'Sets the lore of the item you are holding',
    aliases: ['lr', 'lre'],
    category: 'Miscellanous',
    documentation: {
        usage: 'lr <text>',
        examples: [
            'lr Epic!',
            'lre Welcome!!!'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    // @ts-ignore
    const inventory = chatmsg.sender.getComponent('minecraft:inventory').container, item = inventory.getItem(chatmsg.sender.selectedSlot);
    if (!item)
        return Server.eBroadcast('You need to hold an item!', chatmsg.sender.name, 'Lore');
    item.setLore(args.join(' ').split('\\n'));
    inventory.setItem(chatmsg.sender.selectedSlot, item);
});
