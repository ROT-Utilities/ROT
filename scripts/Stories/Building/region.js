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
import { MinecraftEffectTypes, world } from 'mojang-minecraft';
import { DatabasePaper } from '../../Papers/DatabasePaper.js';
import Server from '../../ServerBook.js';
import { betweenXYZ, setTickInterval } from '../../Papers/paragraphs/ExtrasParagraphs.js';
import config from '../../config.js';
const reg = new DatabasePaper('REG');
Server.command.register({
    cancelMessage: true,
    name: 'region',
    description: 'ROT will protect any region from anything but admins. Admins are weirdos. Imagine being admin XD',
    aliases: ['pt', 'america', 'protect', 'r', 'reg'],
    category: 'Building',
    admin: true,
    documentation: {
        usage: 'reg <create|set|remove|enable|disable|rename|list> <region> <pos1?|pos2?|region?|pvp?|build?|break?|explosions?|join?|leave?> <number?|true?|false?|X?|text?> <Y?> <Z?>',
        information: 'Use the command to create regions that only a select players can build, mine, and fight.',
        examples: [
            'reg create lobby',
            'reg set lobby pos1',
            'reg set lobby pos2',
            'reg set lobby pvp',
            'reg enable lobby',
            'reg set lobby join Welcome to the lobby!',
            'reg rename lobby hub',
            'reg remove hub'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    const create = ['create', 'make', 'start'], list = ['list', 'all', 'tell', 'info', 'information', 'data', 'intel'], del = ['del', 'delete', 'remove', 'yeet'], set = ['set', 'push', 'put'], toggle = ['toggle', 'enable', 'disable', 'on', 'off', 't'], rename = ['rename', 'name', 'rn', 'rname'];
    if (create.includes(args[0])) {
        if (!args[1])
            return Server.eBroadcast('You need to type a region name!', chatmsg.sender.name, 'Region');
        if (reg.has(args[1]))
            return Server.eBroadcast(`This server already has the region "§4${args[1]}§r§c"!`, chatmsg.sender.name, 'Region');
        if (args[1].replace(/[a-zA-Z0-9]/g, '') !== '')
            return Server.eBroadcast('You cannot use special characters!', chatmsg.sender.name, 'Region');
        if (args[2])
            return Server.eBroadcast('No spaces in the region name please!', chatmsg.sender.name, 'Region');
        reg.set(args[1], {
            enabled: 0,
            tag: args[1]
        }, true);
        return Server.broadcast(`The region §c${args[1]}§7 has been created! Once you set all the required information using "§e${Server.lang.prefix}reg set ${args[1]}§7" you can use "§6${Server.lang.prefix}reg toggle ${args[1]}§7"!`, chatmsg.sender.name, 'Region');
    }
    if (!args.length || list.includes(args[0])) {
        if (args[1]) {
            if (!reg.has(args[1]))
                return Server.eBroadcast(`The server doesn't have a region with the name "§4${args[1]}§r§c"!`, chatmsg.sender.name, 'Region');
            const region = reg.get(args[1]), regionData = [
                'Region Mode: §c' + (region.enabled ? '§1Enabled' : '§4Disabled'),
                'Region postion 1: §c' + region.pos1?.join(' ') ?? undefined,
                'Region postion 2: §c' + region.pos2?.join(' ') ?? undefined,
                'Building: §c' + (region.build ? '§1Enabled' : '§4Disabled'),
                'Mining: §c' + (region.mine ? '§1Enabled' : '§4Disabled'),
                'PvP: §c' + (region.pvp ? '§1Enabled' : '§4Disabled'),
                'Allow explosions: §c' + (region.ex ? '§1True' : '§4False'),
                'Join message: §c' + region.join,
                'Leave message: §c' + region.leave,
                'Region tag: §c' + region.tag
            ];
            return Server.broadcast(`Displaying all data for the region §c${args[1]}\n§a ` + regionData.join(`\n §r§a`), chatmsg.sender.name, 'region');
        }
        if (!reg.allKeys().length)
            return Server.eBroadcast('You haven\'t set any regions yet!', chatmsg.sender.name, 'Region');
        const allRegions = reg.allKeys().map(regi => {
            const regionData = reg.get(regi);
            return `§aRegion name: §c${regi}\n §aCoords: §c${regionData.pos1?.join(' ')} §2to §c${regionData.pos2?.join(' ')}\n §aBuild: ${regionData.build ? '§1true' : '§4false'}\n §aMine: ${regionData.mine ? '§1true' : '§4false'}`;
        });
        Server.broadcast(`There are a total of §c${allRegions.length}§7 regions. Here is all regions and some of their info:\n` + allRegions.join(' '), chatmsg.sender.name, 'Region');
        return Server.broadcast('If you want more information like the region join message, just do "§c!region info <region name>§7" :)', chatmsg.sender.name, 'Region');
    }
    if (del.includes(args[0])) {
        if (!args[1])
            return Server.eBroadcast('You need to type a region name!', chatmsg.sender.name, 'Region');
        if (!reg.has(args[1]))
            return Server.eBroadcast(`The server doesn't have a region with the name "§4${args[1]}§r§c"!`, chatmsg.sender.name, 'Region');
        reg.delete(args[1]);
        return Server.broadcast(`The region "§c${args[1]}§7" has been deleted!`, chatmsg.sender.name, 'Region');
    }
    if (!args[1])
        return Server.eBroadcast('You need to type a region name!', chatmsg.sender.name, 'Region');
    if (!reg.has(args[1]))
        return Server.eBroadcast(`The server doesn't have a region with the name "§4${args[1]}§r§c"!`, chatmsg.sender.name, 'Region');
    const region = reg.get(args[1]);
    if (set.includes(args[0])) {
        const pos1 = ['pos', 'pos1', 'p1', 'l1'], pos2 = ['pos2', 'p2', 'l2'], pvp = ['pvp', 'fight', '1v1', 'attack'], build = ['build', 'create', 'place', 'use'], mine = ['destory', 'mine', 'remove'], explosions = ['explosions', 'bomb', 'bombbomb', 'ex', 'exp'], tag = ['tag', 't'], join = ['join', 'j', 'enter'], leave = ['leave', 'l', 'exit'];
        if (pos1.includes(args[2])) {
            let X = parseInt(args[3]), Y = parseInt(args[4]), Z = parseInt(args[5]);
            // @ts-ignore
            if (!args[3])
                X = parseInt(chatmsg.sender.location.x), Y = parseInt(chatmsg.sender.location.y), Z = parseInt(chatmsg.sender.location.z);
            if (isNaN(X) || isNaN(Y) || isNaN(Z))
                return Server.eBroadcast('That is not a set of coordinates!', chatmsg.sender.name, 'Region');
            reg.set(args[1], Object.assign(region, { pos1: [X, Y, Z] }));
            return Server.broadcast(`Postion 1 has been set to §c${X}§7, §c${Y}§7, §c${Z}§7 for §4${args[1]}§7!`, chatmsg.sender.name, 'Region');
        }
        if (pos2.includes(args[2])) {
            let X = parseInt(args[3]), Y = parseInt(args[4]), Z = parseInt(args[5]);
            // @ts-ignore
            if (!args[3])
                X = parseInt(chatmsg.sender.location.x), Y = parseInt(chatmsg.sender.location.y), Z = parseInt(chatmsg.sender.location.z);
            if (isNaN(X) || isNaN(Y) || isNaN(Z))
                return Server.eBroadcast('That is not a set of coordinates!', chatmsg.sender.name, 'Region');
            reg.set(args[1], Object.assign(region, { pos2: [X, Y, Z] }));
            return Server.broadcast(`Postion 2 has been set to §c${X}§7, §c${Y}§7, §c${Z}§7 for §4${args[1]}§7!`, chatmsg.sender.name, 'Region');
        }
        if (pvp.includes(args[2])) {
            reg.set(args[1], Object.assign(region, { pvp: region.pvp ? 0 : 1 }));
            return Server.broadcast(`Members §l${region.pvp ? '§awill' : '§cwill no longer'}§r§7 be able to attack each other in the region §4${args[1]}§7!`, chatmsg.sender.name, 'Region');
        }
        if (build.includes(args[2])) {
            reg.set(args[1], Object.assign(region, { build: region.build ? 0 : 1 }));
            return Server.broadcast(`Members §l${region.build ? '§awill' : '§cwill no longer'}§r§7 be able to build in the region §4${args[1]}§7!`, chatmsg.sender.name, 'Region');
        }
        if (mine.includes(args[2])) {
            reg.set(args[1], Object.assign(region, { mine: region.mine ? 0 : 1 }));
            return Server.broadcast(`Members §l${region.mine ? '§awill' : '§cwill no longer'}§r§7 be able to mine in the region §4${args[1]}§7!`, chatmsg.sender.name, 'Region');
        }
        if (explosions.includes(args[2])) {
            reg.set(args[1], Object.assign(region, { ex: region.ex ? 0 : 1 }));
            return Server.broadcast(`Explosions §l${region.ex ? '§awill' : '§cwill no longer'}§r§7 be able to happen in the region §4${args[1]}§7!`, chatmsg.sender.name, 'Region');
        }
        if (tag.includes(args[2])) {
            if (!args[3]) {
                reg.set(args[1], Object.assign(region, { tag: args[1] }));
                return Server.broadcast(`The tag for the region §c${args[1]}§r§7 has been reset to the default tag §4${args[3]}§r§7!`, chatmsg.sender.name, 'Region');
            }
            if (args[4])
                return Server.eBroadcast('No spaces in the tag name please!', chatmsg.sender.name, 'Region');
            reg.set(args[1], Object.assign(region, { tag: args[3] }));
            return Server.broadcast(`The tag for the region §c${args[1]}§r§7 is now §4${args[3]}§r§7!`, chatmsg.sender.name, 'Region');
        }
        if (join.includes(args[2])) {
            if (!args[3]) {
                reg.set(args[1], Object.assign(region, { join: undefined }));
                return Server.broadcast(`The enter message for the region §c${args[1]}§r§7 is now off!`, chatmsg.sender.name, 'Region');
            }
            reg.set(args[1], Object.assign(region, { join: args.slice(3).join(' ') }));
            return Server.broadcast(`The enter message for the region §c${args[1]}§r§7 is now "§4${args.slice(3).join(' ')}§r§7"!`, chatmsg.sender.name, 'Region');
        }
        if (leave.includes(args[2])) {
            if (!args[3]) {
                reg.set(args[1], Object.assign(region, { leave: undefined }));
                return Server.broadcast(`The leave message for the region §c${args[1]}§r§7 is now off!`, chatmsg.sender.name, 'Region');
            }
            reg.set(args[1], Object.assign(region, { leave: args.slice(3).join(' ') }));
            return Server.broadcast(`The leave message for the region §c${args[1]}§r§7 is now "§4${args.slice(3).join(' ')}§r§7"!`, chatmsg.sender.name, 'Region');
        }
    }
    if (toggle.includes(args[0])) {
        if (!region.pos1)
            return Server.eBroadcast(`§4${args[1]}§c's postion 1 is not set! You can set it by typing "§4!reg set ${args[1]} pos1§c" in chat.`, chatmsg.sender.name, 'Region');
        if (!region.pos2)
            return Server.eBroadcast(`§4${args[1]}§c's postion 2 is not set! You can set it by typing "§4!reg set ${args[1]} pos2§c" in chat.`, chatmsg.sender.name, 'Region');
        reg.set(args[1], Object.assign(region, { enabled: region.enabled ? 0 : 1 }));
        return Server.broadcast(`§c${args[1]}§r§7 is now §l${region.enabled ? '§aEnabled' : '§cDisabled'}§r§7! To let a member bypass the region (Expect for PvP) they need the §2${args[1]}§7. You can give a member the tag by running the command §6/tag "name" add ${args[1]}§7 in chat.`, chatmsg.sender.name, 'Region');
    }
    if (rename.includes(args[0])) {
        reg.set(args[2], region, true);
        reg.delete(args[1]);
        return Server.broadcast(`The region "§c${args[1]}§7" has been renamed to "§c${args[2]}§7"!`, chatmsg.sender.name, 'Region');
    }
    Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'Region');
});
//World Events
world.events.blockBreak.subscribe(({ block, brokenBlockPermutation, dimension, player }) => !player?.hasTag(config.adminTag) && reg.allValues()?.forEach(region => {
    if (!region.enabled || region.mine || player.hasTag(region.tag) || !betweenXYZ([...region.pos1], [...region.pos2], [block.location.x, block.location.y, block.location.z]))
        return;
    dimension.getBlock(block.location).setPermutation(brokenBlockPermutation.clone());
    Server.runCommand(`kill @e[type=minecraft:item,x=${block.x},y=${block.y},z=${block.z},r=2.5]`);
    config.tellRegionMine && Server.broadcast('§cYou do not have permission to break blocks here!', player.nameTag, 'Region');
}));
world.events.beforeItemUseOn.subscribe(data => !data?.source?.hasTag(config.adminTag) && reg.allValues()?.some(region => {
    if (!region.enabled || region.build || data.source.hasTag(region.tag) || !betweenXYZ([...region.pos1], [...region.pos2], [data.blockLocation.x, data.blockLocation.y, data.blockLocation.z]))
        return;
    config.tellRegionBuild && Server.broadcast('§cYou do not have permission to build here!', data.source.nameTag, 'Region');
    return true;
}) && (data.cancel = true));
world.events.entityHit.subscribe(({ entity, hitEntity }) => hitEntity && reg.allValues()?.forEach(region => {
    if (!region.enabled || region.pvp || !betweenXYZ([...region.pos1], [...region.pos2], [hitEntity.location.x, hitEntity.location.y, hitEntity.location.z]))
        return;
    config.tellRegionHit && Server.broadcast('§cYou do not have permission to attack players in here!', entity.nameTag, 'Region');
}));
world.events.beforeExplosion.subscribe(data => {
    const nonBlocks = reg.allValues()?.filter(reg => reg.enabled && !data.source.hasTag(reg.tag) && !reg.ex);
    if (nonBlocks.length && data.impactedBlocks?.filter(block => nonBlocks.length === nonBlocks?.filter(area => betweenXYZ([...area.pos1], [...area.pos2], [block.x, block.y, block.z])).length).length) {
        config.tellRegionExplode && Server.broadcast('§cLook, I don\'t know who it was... But you do NOT have permission to blow up blocks here!', `@a[x=${data.impactedBlocks[0].x},y=${data.impactedBlocks[0].y},z=${data.impactedBlocks[0].z},r=15]`, 'Region');
        return data.cancel = true;
    }
});
//Stops players from hitting each other
let regs = {};
world.events.playerLeave.subscribe(({ playerName }) => delete regs[playerName]);
setTickInterval(() => {
    const allRegs = reg.allValues();
    for (const player of world.getPlayers()) {
        allRegs?.forEach(region => {
            if (region.enabled && betweenXYZ([...region.pos1], [...region.pos2], [player.location.x, player.location.y, player.location.z])) {
                if (!region.pvp) {
                    player.addEffect(MinecraftEffectTypes.resistance, 40, 255);
                    player.addEffect(MinecraftEffectTypes.instantHealth, 40, 255);
                    player.addEffect(MinecraftEffectTypes.weakness, 40, 255);
                }
                if (!regs[player.nameTag]?.[region.tag]) {
                    region.join ? Server.broadcast(region.join, player.nameTag, 'Region') : '';
                    Object.assign(reg, { [player.nameTag]: Object.assign(regs[player.nameTag] ?? {}, { [region.tag]: 1 }) });
                }
            }
            else if (regs[player.nameTag]?.[region.tag]) {
                region.leave ? Server.broadcast(region.leave, player.nameTag, 'Region') : '';
                Object.assign(reg, { [player.nameTag]: Object.assign(regs[player.nameTag] ?? {}, { [region.tag]: 0 }) });
            }
        });
    }
});
