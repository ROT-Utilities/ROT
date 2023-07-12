/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
Aex66 (Developer)
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
__________ ___________________
\______   \\_____  \__    ___/
 |       _/ /   |   \|    |
 |    |   \/    |    \    |
 |____|_  /\_______  /____|
        \/         \/
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
© Copyright 2023 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Website: https://www.rotmc.ml
Thank you!
*/
import { world } from "@minecraft/server";
import { sleep } from "../../Papers/Paragraphs/ExtrasParagraphs.js";
import Commands from "../../Papers/CommandPaper/CommandPaper.js";
import Server from "../../Papers/ServerPaper.js";
import quick from "../../quick.js";
if (!Server.db.has('warps'))
    Server.db.write('warps', {});
const cmd = Commands.create({
    name: 'warp',
    description: 'Use this command to teleport around the map.',
    aliases: ['w', 'wrp'],
    category: 'Server',
    developers: ['Mo9ses']
});
cmd.startingArgs(['set', 'list', 'remove', 'warp']);
cmd.unknownType('tag', null, 1);
cmd.locationType('loc', null, 'tag', false, false);
cmd.playerType('plr');
cmd.staticType('set', 'set', async (plr, val, args) => {
    if (val.length > 12)
        return plr.error('The warp name has to be §4§l12§r§c characters or less.');
    const warps = Server.db.read('warps'), amount = Object.keys(warps).length;
    warps[val] = [args[1], [parseInt(`${args[0].x}`), parseInt(`${args[0].y}`), parseInt(`${args[0].z}`), plr.dimension.id]];
    Server.db.write('warps', warps);
    plr.send(`You have set a warp with the name §c${val}§e at: §a${parseInt(`${args[0].x}`)}§e, §a${parseInt(`${args[0].y}`)}§e, §a${parseInt(`${args[0].z}`)}§e, §din the ${plr.dimension.id.replace('minecraft:', '')}§e.`);
    await sleep(40);
    if (amount > 30)
        plr.tip(`The server has over §c§l30§r§e (§4§l${amount}§r§e) warps! Having more than §c30§e could cause the server to lag.§o§7 I haven't actually tested this, it should handle like 100`);
}, 'loc', true);
cmd.staticType('list', 'list', plr => {
    const warps = Object.entries(Server.db.read('warps')).filter(w => plr.isAdmin || !w[1][0] ? true : plr.hasTag(w[1][0]));
    if (!warps.length)
        return plr.error('The server doesn\'t have any warps available to you.');
    plr.send(`This server has total of §a${warps.length}§e warp(s). Here's the list of the server's warps: \n§l` + warps.map(w => `§c§l${w[0]}§r §eat §a${w[1][1][0]}§e, §a${w[1][1][1]}§7, §a${w[1][1][2]}§e, §din the ${w[1][1][3].replace('minecraft:', '')}§e. §eTag: §a${w[1][0] ?? '§4none'}`).join('\n'));
}, [], false);
cmd.staticType('remove', 'remove', (plr, val) => {
    const warps = Server.db.read('warps');
    if (!warps.hasOwnProperty(val))
        return plr.error('The server doesn\'t have a warp with that name.');
    plr.send(`Successfully removed warp with the name §c${val}§e at: §a${warps[val][1][0]}§e, §a${warps[val][1][1]}§e, §a${warps[val][1][2]}§e, §din the ${warps[val][1][3].replace('minecraft:', '')}§e.`);
    delete warps[val];
    Server.db.write('warps', warps);
});
cmd.unknownType('warp', (plr, val, args) => {
    const warp = Object.entries(Server.db.read('warps')).find(w => w[0] === val && (plr.isAdmin || !w[1][0] ? true : plr.hasTag(w[1][0])));
    if (!warp)
        return plr.error('This server doesn\'t have a warp with that name. Make sure it exist and you have permission to teleport to it.');
    const target = args.length ? args[0] : plr;
    if (target.name !== plr.name && !plr.isAdmin)
        return plr.error('You don\'t have perrmission to teleport other players');
    target.addTag(quick.epics['Automod'].protections.teleport.skip);
    target.teleport({ x: warp[1][1][0], y: warp[1][1][1], z: warp[1][1][2] }, { dimension: world.getDimension(warp[1][1][3]), rotation: { x: target.getRotation().x, y: target.getRotation().y } });
    target.send(`You have been teleported to §a§l${val}§r§e.`);
}, 1, true, 'plr');
cmd.config(['set', 'remove'], {
    admin: true
});
