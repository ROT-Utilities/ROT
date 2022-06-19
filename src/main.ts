/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
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
import Server from './ServerBook.js';
import { EntityQueryOptions, Location, world, ItemStack, MinecraftEnchantmentTypes, MinecraftItemTypes, MinecraftEffectTypes, Items } from 'mojang-minecraft';
import { updateLeaderboard, getRanks, getColors, setTickInterval, betweenXYZ, twoStepKick, isReach } from './Papers/paragraphs/ExtrasParagraphs.js';
import config from './config.js'
import { metricNumbers } from './Papers/paragraphs/ConvertersParagraphs.js';
/*
* Welcome to the AR page!
* Main Developer: Mo9ses
* Notes: This is the stuff that ROT always has running
* Sub developer: NOBODY!
* Link to name: Runtime
*/
export let plotCache: any = {}, playerID: any = {};
let ready = false, totalTick = 0, mines: any = {}, memberJoin: string[] = [], allEnchantments = Object.values(MinecraftEnchantmentTypes);
world.events.tick.subscribe(() => {
    if(ready) return;
    if(!Server.runCommand('testfor @a').error && !ready) {
        ready = true;
        Server.broadcast(`§c§l` + Server.lang.main1 + ' ' + totalTick + ' ' + Server.lang.main2);
        //Objectives
        Server.runCommands([
            //Adding objectives
            'scoreboard objectives add ROTplayerUUID dummy "§aPlayer IDs"',
            'scoreboard objectives add ROTnftj dummy',
            'scoreboard objectives add ROTCommandTimeout dummy',
            'scoreboard objectives add ROTh dummy "§d§lHearts"',
            'scoreboard objectives add ROThomeX dummy',
            'scoreboard objectives add ROThomeY dummy',
            'scoreboard objectives add ROThomeZ dummy',
            'scoreboard objectives add ROThomeDim dummy',
            'scoreboard objectives add ROTseconds dummy',
            'scoreboard objectives add ROTafk dummy',
            'scoreboard objectives add ROTMessageMute dummy',
            'scoreboard objectives add ROTseconds dummy',
            'scoreboard objectives add ROTminutes dummy',
            'scoreboard objectives add ROThours dummy',
            'scoreboard objectives add ROTPrivateChat dummy',
            'scoreboard objectives add ROTTimezone dummy',
            //Removing old objectives
            'scoreboard objectives remove GAMETEST_DB',
            'scoreboard objectives remove ROT_DATABASE',
            'scoreboard objectives remove ROT-DATABASE'
        ]);
        Server.tpa.clear();
    }
    totalTick++;
});
setTickInterval(() => {
    // Tests if ROT is setup and enabled
    if(!Server.settings.getScore('ROT')) return;
    // Statics
    const today = new Date();
    if(memberJoin.length) {
        let bannedPlayers = Server.bans.getCollection(), banUUIDs = {};
        if(bannedPlayers) for(let key in bannedPlayers) {
            if(bannedPlayers[key]?.unbanTime < today.getTime()) Server.bans.delete(key); else
            Object.assign(banUUIDs, { [bannedPlayers[key].bannedPlayer]: bannedPlayers[key]?.playerUUID ?? null });
        }
        memberJoin.forEach(member => {
            if(!Server.player.list().includes(member)) return; memberJoin.splice(memberJoin.findIndex(name => name === member), 1);
            //if(member.replace(/[a-zA-Z0-9 ]/g, '') !== '') return twoStepKick(Server.player.fetch(member));
            Server.player.list().forEach((_: string, i: number) => {
                if(Object.values(playerID).includes(i + 1)) return;
                Object.assign(playerID, { [member]: i + 1 });
            });
            if(Object.keys(banUUIDs).includes(member) || Object.values(banUUIDs).includes(Server.player.getScore('ROTplayerUUID', member))) {
                const banData = Object.keys(banUUIDs).includes(member) ? bannedPlayers[member] : bannedPlayers[Object.values(banUUIDs).find(UUID => UUID === Server.player.getScore('ROTplayerUUID', member)) as string];
                if(Server.bans.has(banData?.bannedPlayer)) twoStepKick(Server.player.fetch(member), banData);
            }
            if(config.joinTeleport) Server.player.fetch(member).teleport(new Location(Server.settings.get('spawn')[0], Server.settings.get('spawn')[1], Server.settings.get('spawn')[2]), world.getDimension(Server.settings.get('spawn')[3]), 0, 0);
            Server.settings.set('members', Object.assign(Server.settings.get('members') ?? {}, {
                [Server.player.getScore('ROTplayerUUID', member)]: [
                    member,
                    Server.settings.get('members')?.hasOwnProperty(Server.player.getScore('ROTplayerUUID', member)) ? Server.settings.get('members')[Server.player.getScore('ROTplayerUUID', member)].slice(1) : `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()} at ${today.getHours()}:${today.getMinutes()}:` + today.getSeconds()
                ].flat()
            }));
            Server.runCommand(`scoreboard players set "${member}" ROTafk ` + Server.settings.getScore('kickTime'));
            if(config.joinMessage) if(!Server.player.getScore('ROTnftj', member)) {
                Server.broadcast(Server.lang.newWelcome, member);
                Server.broadcast(`§6§l${member}§r§7 ${Server.lang.joined1}§6§l${Object.keys(Server.settings.get('members')).length}§r§7 ` + Server.lang.joined2);
                Server.runCommand(`scoreboard players set "${member}" ROTnftj 1`);
            } else Server.broadcast(Server.lang.welcomeback, member, 'ROT');
            if(config.fireworksAgain) Server.runCommand(`execute "${member}" ~~~ summon fireworks_rocket ~~~`);
        });
    }
    for(const player of world.getPlayers()) {
        if(config.smyte && player.hasTag('smite')) {
            Server.broadcast(`§6${player.nameTag}§7 ` + Server.lang.smite);
            Server.runCommands([
                `execute "${player.nameTag}" ~~~ summon lightning_bolt ~~~`,
                `effect "${player.nameTag}" levitation 1 150 true`,
                `tag "${player.nameTag}" remove smite`
            ]);
        }
        if(config.anti32k && !player.hasTag(config.adminTag)) {
            // @ts-ignore
            let inventory = player.getComponent('minecraft:inventory').container;
            for(let i = 0; i < inventory.size; i++) {
                let item = inventory.getItem(i); if(!item) continue;
                if(config.bannedItems.includes(item.id)) inventory.setItem(i, new ItemStack(MinecraftItemTypes.air));
                const itemEnchantments = item.getComponent('enchantments').enchantments;
                allEnchantments.forEach(ench => {
                    if(itemEnchantments.hasEnchantment(ench) < (ench.maxLevel + config.maxEnchant)) return;
                    inventory.setItem(i, new ItemStack(MinecraftItemTypes.air));
                });
            }
        }
    }
    if(Server.settings.getScore('tpa')) {
        const allTPAs = Server.tpa.getCollection();
        if(allTPAs) for(let key in allTPAs) if(allTPAs.hasOwnProperty(key) && allTPAs[key].sender && allTPAs[key].timeLeft < Date.now()) {
            Server.eBroadcast(`The TPA you sent to §4${allTPAs[key].sender}§c has expired!`, allTPAs[key].sender, 'TPA');
            Server.tpa.delete(key);
        }
    }
    if(Server.settings.getScore('sleep')) Server.runCommand('execute @a[tag=is_sleeping] ~~~ time add 100');
    if(Server.settings.getScore('health')) Server.runCommand('scoreboard objectives setdisplay belowname ROTh');
    if(config.leaderboard) try {
        const options = new EntityQueryOptions();
        options.type = "minecraft:rabbit";
        options.tags = ['ROTLB'];
        for(const dim of ['overworld', 'nether', 'the end']) {
            let entities = world.getDimension(dim).getEntities(options) ?? undefined;
            if(entities) for(const entity of entities) updateLeaderboard(entity);
        }
    } catch {}
    //Random target
    try {
        var RP = Server.runCommand('testfor @r').statusMessage.replace('Found', '').trim();
    } catch {
        return;
    }
    if (Server.gens.getCollection()) for (let key in Server.gens.getCollection()) {
        const gens = Server.gens.getCollection()
        try {if (!gens[key]?.toggle) continue;
        const gen = Server.gens.get(gens[key].name)
        Server.gens.set(gen.name, {name: gen.name,dimension: gen.dimension,x: gen.x,y: gen.y,z: gen.z,item: gen.item,amount: gen.amount,data: gen.data,ticks: gen.ticks,currentTick: gen.currentTick -= 20,toggle: gen.toggle})
        Server.broadcast(Server.gens.get(gen.name).currentTick)
        if (gen.currentTick <= 0) {
            world.getDimension(gen.dimension).spawnItem(new ItemStack(Items.get(gen.item), gen.amount, gen.data), new Location(gen.x, gen.y, gen.z))
            Server.gens.set(gen.name, {
                name: gen.name,
                dimension: gen.dimension,
                x: gen.x,
                y: gen.y,
                z: gen.z,
                item: gen.item,
                amount: gen.amount,
                data: gen.data,
                ticks: gen.ticks,
                currentTick: gen.ticks,
                toggle: gen.toggle
            })
        }} catch (e) {Server.eBroadcast(e, ': ', e.stack)}
    }
    //if(RP.replace(/[a-zA-Z0-9 ]/g, '') !== '') return twoStepKick(Server.player.fetch(RP));
    //Always active commands
    Server.runCommands([
        'tag @a[tag=v] add ' + config.trustedTag,
        'tag @a[tag=v] remove mute',
        //Timings
        'scoreboard players remove @a[scores={ROTMessageMute=1..}] ROTMessageMute 1',
        'scoreboard players remove @a[scores={ROTCommandTimeout=1..}] ROTCommandTimeout 1',
        'scoreboard players add @a ROTseconds 1',
        'scoreboard players add @a[scores={ROTseconds=60}] ROTminutes 1',
        'scoreboard players reset @a[scores={ROTseconds=60}] ROTseconds',
        'scoreboard players add @a[scores={ROTminutes=60}] ROThours 1',
        'scoreboard players reset @a[scores={ROTminutes=60}] ROTminutes',
        //Add score
        'scoreboard players add @a ROTplayerUUID 0',
        'scoreboard players add @a ROTPrivateChat 0',
        'scoreboard players random @a[scores={ROTplayerUUID=0}] ROTplayerUUID -2000000 2000000',
        //Systems
        `scoreboard players set @a[tag=is_moving,name="${RP}"] ROTafk ` + Server.settings.getScore('kickTime'),
        'scoreboard players remove @a[tag=!is_moving,scores={ROTafk=1..}] ROTafk 1',
        `tag @a[tag=!is_moving,scores={ROTafk=${Math.round(Server.settings.getScore('kickTime') / 2)}}] add afk`,
        'effect @a[tag=ROTTimeout] slowness 10 255 true',
        'effect @a[tag=ROTTimeout] weakness 10 255 true',
        'effect @a[tag=ROTTimeout] resistance 10 255 true',
        'effect @a[tag=ROTTimeout] instant_health 10 255 true',
        'effect @a[tag=ROTTimeout] mining_fatigue 10 255 true',
        'tp @a[tag=ROTTimeout] 0 32767 0 facing 0 32767 0',
        'kill @e[type=ROTPlotKill]'
    ]);
    // @ts-ignore || Systems and features
    if(config.forceAdmin) if(Server.player.isAdmin(RP) && !config.forcedAdmins.includes(RP)) {
        Server.bans.set(RP, {
            bannedPlayer: RP,
            date: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
            length: 3.154e+10,
            unbanTime: today.getTime() + 3.154e+10,
            reason: 'This member has a admin tag and is NOT listed as a admin in the config file.',
            bannedBy: 'ROT',
            playerUUID: Server.player.getScore('ROTplayerUUID', RP)
        }, true);
        Server.broadcast(`Successfully banned §c${RP}§7 for §c1 year§7 for "§cThis member has a admin tag and is NOT listed as a admin in the config file.§7"`, '@a', 'ROT');
    }
    if(Server.player.findTag('afk', RP) && Server.settings.getScore('AFK')) {
        if(Server.player.findTag('is_moving', RP)) {
            Server.runCommand(`tag "${RP}" remove afk`);
            Server.broadcast(`§c${RP}§7 is back! Woo Ig`, `@a[name=!"${RP}"]`, 'ROT');
            Server.broadcast('Welcome back Ig', RP, 'ROT');
        }
        if(Server.player.getScore('ROTafk', RP) === Math.round(Server.settings.getScore('kickTime') / 2)) Server.player.isTrusted(RP) ? Server.broadcast(`§c${RP}§7 is §e§lAFK§r§7! Tell them to come back! They are wasting §4§lROT's§r§7 resources! Ahhhhhhhh!`, '@a', 'ROT') : Server.broadcast(`§c${RP}§7 is §e§lAFK§r§7!` + (config.kickAFK ? ` Tell them to come back or they will be kicked in §c§l${Math.round(Server.settings.getScore('kickTime') / 2)}§r§7 seconds!` : ''), '@a', 'ROT');
        if(!Server.player.getScore('ROTafk', RP) && !Server.player.isTrusted(RP) && config.kickAFK) {
            Server.runCommands([
                `scoreboard players set "${RP}" ROTafk ` + Server.settings.getScore('kickTime'),
                `tag "${RP}" remove afk`,
                `kick "${RP}" §eYou have been kicked from the server for being inactive for too long! You may join back in 5 seconds after this message.`
            ]);
            Server.broadcast(`§c${RP}§7 has been kicked from the server for being inactive for too long. They can rejoin in 5 seconds.`, '@a', 'ROT');
        }
    }
    if(Server.settings.getScore('KTT')) {
        let tag = Server.settings.get('KTTag') ?? 'kick', reason = Server.settings.get('KTMsg') ?? '§9§lYou currently cannot play on this server ;(';
        if(!Server.player.isAdmin(RP) && ((!Server.settings.getScore('KTR') && Server.player.findTag(tag, RP)) || (!Server.player.findTag(tag, RP)))) Server.runCommand(`kick "${RP}" ` + reason);
    }
    for(let tag of Server.player.getTags(RP)) {
        if(Server.sc.has(tag)) {
            let board = Server.sc.get(tag).join('§r\n').replace(/\(rank\)/g, getRanks(RP) + '§r').replace(/\(name\)/g, getColors(RP) + RP + '§r');
            if(/(?<=\(score:).+?(?=\))/.test(board)) board.match(/(?<=\(score:).+?(?=\))/g).map((obj: any) => board = board.replace(`(score:${obj})`, Server.player.getScore(obj, RP) ? metricNumbers(Server.player.getScore(obj, RP)) : 0));
            Server.runCommand(`titleraw "${RP}" title {"rawtext":[{"text":${JSON.stringify(board)}}]}`);
        }
        if(config.ROTCommandTag && tag.startsWith('ROT')) {
            let fullCommand = tag.match(/(?<=ROT).*/)[0],
                args = fullCommand.trim().split(/\s+/),
                command = args.shift().toLowerCase(),
                commandREG = Server.command.getRegistration(command),
                isAdmin = false;
            if(Server.player.isAdmin(RP)) isAdmin = true;
            Server.runCommands([`tag "${RP}" remove "${tag}"`, `tag "${RP}" add ` + config.adminTag]);
            if(commandREG) try {
                commandREG.callback({
                    "sender": Server.player.fetch(RP),
                    "message": fullCommand,
                    "cancel": Server.command.getRegistration(command).cancelMessage,
                    "sendToTargets": false,
                    "targets": []
                }, args);
            } catch(e) {
                Server.eBroadcast(e + e.stack, RP, 'ROT');
            }
            if(!isAdmin) Server.runCommand(`tag "${RP}" remove ` + config.adminTag);
        }
    }
}, 20);
world.events.playerJoin.subscribe(data => {
    Object.assign(mines, { [data.player.name]: null });
    memberJoin.push(data.player.name);
});
world.events.playerLeave.subscribe(data => {
    delete playerID[data.playerName];
    delete plotCache[data.playerName];
    delete mines[data.playerName];
});
if(config.antiNuker) world.events.blockBreak.subscribe(({ block, brokenBlockPermutation, dimension, player }) => {
    const mine = mines[player.name];
    if(!vegetation.includes(block.id)) return;
    Object.assign(mines, { [player.name]: Date.now() });
    if(mine < (Date.now() - 50) || player.hasTag(config.adminTag)) return;
    dimension.getBlock(block.location).setPermutation(brokenBlockPermutation.clone());
    Server.runCommand(`kill @e[type=minecraft:item,x=${block.x},y=${block.y},z=${block.z},r=2.5]`);
});
// @ts-ignore
if(config.bannedItems?.length) world.events.beforeItemUseOn.subscribe(data => !data.source.hasTag(config.adminTag) && config.bannedBlocks.includes(data.item.id) && (data.cancel = true));
// if(config.antiCrasher) world.events.tick.subscribe(() => {
//     for(const player of world.getPlayers()) if(Math.abs(player.location.x) > 30000000 || Math.abs(player.location.y) > 30000000 || Math.abs(player.location.z) > 30000000) {
//         player.teleport(new Location(0, 0, 0), player.dimension, 0, 0);
//         if(player.hasTag(config.adminTag) || Server.bans.has(player.name)) return Server.broadcast('§bPlease don\'t crash the server! It\'s sooo lonely here without any players :(', player.name, '§1ROT§c');
//         const today = new Date();
//         Server.bans.set(player.name, {
//             bannedPlayer: player.name,
//             date: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
//             length: 3.154e+10,
//             unbanTime: today.getTime() + 3.154e+10,
//             reason: '§cAttemping to crash the server!',
//             bannedBy: 'ROT',
//             playerUUID: Server.player.getScore('ROTplayerUUID', player.name)
//         }, true);
//         Server.broadcast(`Successfully banned §c${player.name}§7 for §c1 year§7 for "§cAttemping to crash the server!§7" by §cROT!`, '@a', 'ROT');
//         twoStepKick(player, Server.bans.get(player.name));
//     }
// });
// if(config.antiReach) {
//     world.events.beforeItemUseOn.subscribe((data) => {
//         if(!isReach(data.source.location, data.blockLocation)) return;
//         data.cancel = true;
//     });
//     world.events.blockBreak.subscribe((data) => {
//         if(!isReach(data.player.location, data.block.location)) return;
//         data.dimension.getBlock(data.block.location).setPermutation(data.brokenBlockPermutation);
//     });
//     world.events.entityHit.subscribe(data => {
//         if(!data.hitEntity?.location || data.entity.hasTag(config.adminTag) || !isReach(data.entity.location, data?.hitEntity.location) || data.entity.id !== 'minecraft:player') return;
//         const today = new Date();
//         Server.bans.set(data.entity.nameTag, {
//             bannedPlayer: data.entity.nameTag,
//             date: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
//             length: 2.628e+9,
//             unbanTime: today.getTime() + 2.628e+9,
//             reason: '§cUsing reach!',
//             bannedBy: 'ROT',
//             playerUUID: Server.player.getScore('ROTplayerUUID', data.entity.nameTag)
//         }, true);
//         Server.broadcast(`Successfully banned §c${data.entity.nameTag}§7 for §c1 month§7 for "§cUsing reach!§7" by §cROT!`, '@a', 'ROT');
//         // @ts-ignore
//         twoStepKick(data.entity, Server.bans.get(data.entity.nameTag));
//     });
// }

/*
 * Welcome to the Main page!
 * Main Developer: Mo9ses
 * Sub developer: notbeer
 * Link to name: MAIN ROT
 ***************************
 * List of all the stories!
*///ROT
if(config.ROT) import('./Stories/ROT/Main.js');
if(config.help) import('./Stories/ROT/help.js')
if(config.setup) import('./Stories/ROT/setup.js');
if(config.debug) import('./Stories/ROT/debug.js');
if(config.prefix) import('./Stories/ROT/prefix.js');
if(config.reset) import('./Stories/ROT/reset.js');
if(config.db) import('./Stories/ROT/db.js');
//Server
if(config.Server) import('./Stories/Server/Main.js');
if(config.broadcast) import('./Stories/Server/broadcast.js');
if(config.close) import('./Stories/Server/close.js');
if(config.members) import('./Stories/Server/members.js');
if(config.clearchat) import('./Stories/Server/clearchat.js');
if(config.scoreboard) import('./Stories/Server/scoreboard.js');
if(config.discord) import('./Stories/Server/discord.js');
if(config.realm) import('./Stories/Server/realm.js');
//Management
if(config.Management) import('./Stories/Management/Main.js');
if(config.ban) import('./Stories/Management/ban.js');
if(config.mute) import('./Stories/Management/mute.js');
if(config.ranks) import('./Stories/Management/ranks.js');
if(config.colors) import('./Stories/Management/colors.js');
if(config.inventory) import('./Stories/Management/inventory.js');
if(config.kicktags) import('./Stories/Management/kicktags.js');
if(config.AFK) import('./Stories/Management/AFK.js');
if(config.timeout) import('./Stories/Management/timeout.js');
if(config.tac) import('./Stories/Management/tac.js');
//Miscellaneous
if(config.Miscellaneous) import('./Stories/Miscellaneous/Main.js');
if(config.smyte) import('./Stories/Miscellaneous/smyte.js');
if(config.nothing) import('./Stories/Miscellaneous/nothing.js');
if(config.privatechat) import('./Stories/Miscellaneous/privatechat.js');
if(config.timezone) import('./Stories/Miscellaneous/timezone.js');
if(config.dimension) import('./Stories/Miscellaneous/dimension.js');
if(config.lore || config.click) import('./Stories/Miscellaneous/item.js');
if(config.sudo) import('./Stories/Miscellaneous/sudo.js');
if(config.gen) import('./Stories/Miscellaneous/gen.js');
//Escape
if(config.Escape) import('./Stories/Escape/Main.js');
if(config.warp) import('./Stories/Escape/warp.js');
if(config.pwarp) import('./Stories/Escape/pwarp.js');
if(config.cmd) import('./Stories/Escape/cmd.js');
if(config.feed) import('./Stories/Escape/feed.js');
if(config.heal) import('./Stories/Escape/heal.js');
if(config.top) import('./Stories/Escape/top.js');
if(config.kill) import('./Stories/Escape/kill.js');
if(config.vanish) import('./Stories/Escape/vanish.js');
if(config.health) import('./Stories/Escape/health.js');
if(config.wild) import('./Stories/Escape/wild.js');
if(config.home) import('./Stories/Escape/home.js');
if(config.spawn) import('./Stories/Escape/spawn.js');
if(config.tpa) import('./Stories/Escape/tpa.js');
if(config.sleep) import('./Stories/Escape/sleep.js');
if(config.GMS) import('./Stories/Escape/GMS.js');
if(config.GMC) import('./Stories/Escape/GMC.js');
if(config.GMA) import('./Stories/Escape/GMA.js');
if(config.GMA) import('./Stories/Escape/repair.js');
if (config.near) import('./Stories/Escape/near.js');
//Building
if(config.Building) import('./Stories/Building/Main.js');
if(config.text) import('./Stories/Building/text.js');
if(config.leaderboard) import('./Stories/Building/leaderboard.js');
if(config.plot) import('./Stories/Building/plots.js');
if(config.region) import('./Stories/Building/region.js');
//Fantasy
if(config.Fantasy) import('./Stories/Fantasy/Main.js');
if(config.rickroll) import('./Stories/Fantasy/rickroll.js');
if(config.rottle) import('./Stories/Fantasy/rottle.js');

//Other data
const vegetation = [
    "minecraft:yellow_flower",
    "minecraft:red_flower",
    "minecraft:double_plant",
    "minecraft:wither_rose",
    "minecraft:tallgrass",
    "minecraft:hanging_roots",
    "minecraft:leaves",
    "minecraft:leaves2",
    "minecraft:azalea_leaves",
    "minecraft:azalea_leaves_flowered",
    "minecraft:deadbush",
    "minecraft:cocoa",
    "minecraft:chorus_plant",
    "minecraft:chorus_flower",
    "minecraft:cave_vines",
    "minecraft:cave_vines_body_with_berries",
    "minecraft:cave_vines_head_with_berries",
    "minecraft:glow_berries",
    "minecraft:carrots",
    "minecraft:cactus",
    "minecraft:big_dripleaf",
    "minecraft:beetroot",
    "minecraft:bamboo",
    "minecraft:bamboo_sapling",
    "minecraft:azalea",
    "minecraft:flowering_azalea",
    "minecraft:waterlily",
    "minecraft:melon_block",
    "minecraft:melon_stem",
    "minecraft:potatoes",
    "minecraft:pumpkin",
    "minecraft:carved_pumpkin",
    "minecraft:pumpkin_stem",
    "minecraft:sapling",
    "minecraft:seagrass",
    "minecraft:small_dripleaf_block",
    "minecraft:spore_blossom",
    "minecraft:reeds",
    "minecraft:sweet_berry_bush",
    "minecraft:sweet_berries",
    "minecraft:vine",
    "minecraft:wheat",
    "minecraft:kelp",
    "minecraft:crimson_fungus",
    "minecraft:warped_fungus",
    "minecraft:glow_lichen",
    "minecraft:brown_mushroom",
    "minecraft:red_mushroom",
    "minecraft:nether_wart",
    "minecraft:nether_sprouts",
    "minecraft:crimson_roots",
    "minecraft:warped_roots",
    "minecraft:twisting_vines",
    "minecraft:weeping_vines"
];