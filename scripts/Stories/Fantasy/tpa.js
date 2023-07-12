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
import Commands from "../../Papers/CommandPaper/CommandPaper.js";
import { system } from "@minecraft/server";
import quick from "../../quick.js";
const requests = [];
const cmd = Commands.create({
    name: 'tpa',
    category: 'Fantasy',
    description: 'Send and receive tpa requests!',
});
cmd.startingArgs(['send', 'accept', 'decline']);
cmd.playerType('plr', undefined, true, undefined, { self: false });
cmd.staticType('send', 'send', (plr, val, target) => {
    if (hasRequest(plr, target[0]))
        return plr.error('You already sent a TPA request to this player.', 'TPA');
    plr.send(`You sent a TPA request to §a${target[0].name}`, 'TPA');
    target[0].send(`§a${plr.name}§e sent you a tpa request, type §c"!tpa accept ${plr.name}"§e to accept or §c"tpa decline ${plr.name}"§e to decline`, 'TPA');
    requests.push({ sender: plr, target: target[0], expires: Date.now() + 30000 });
}, 'plr', false, true);
cmd.staticType('accept', 'accept', (plr, val, sender) => {
    if (!hasRequest(sender[0], plr))
        return plr.error(`§a${sender[0].name}§e has not sent you a TPA request`, 'TPA');
    sender[0].send(`Teleporting to §a${plr.name}'s§e location...`, 'TPA');
    plr.send(`You accepted §a${sender[0].name}'s §eTPA request`, 'TPA');
    plr.addTag(quick.epics['Automod'].protections.teleport.skip);
    sender[0].teleport(plr.location, { dimension: plr.dimension, rotation: { x: plr.getRotation().x, y: plr.getRotation().y } });
    requests.splice(requests.indexOf(getRequest(sender[0], plr)));
}, 'plr', false, true);
cmd.staticType('decline', 'decline', (plr, val, sender) => {
    if (!hasRequest(sender[0], plr))
        return plr.error(`§a${sender[0].name}§e has not sent you a TPA request`, 'TPA');
    sender[0].send(`§a${plr.name}§e declined your TPA request`, 'TPA');
    plr.send(`You declined §a${sender[0].name}'s §eTPA request`, 'TPA');
    requests.splice(requests.indexOf(getRequest(sender[0], plr)));
}, 'plr', false, true);
system.runInterval(() => {
    requests.forEach((r, index) => {
        if (Date.now() < r.expires)
            return;
        requests.splice(index);
        r.sender?.send(`The tpa request you sent to §a${r.target?.name}§e has expired`, 'TPA');
        r.target?.send(`§a${r.sender?.name}'s§e TPA request has expired`, 'TPA');
    });
});
function hasRequest(sender, target) {
    return requests.some(r => r.sender?.rID === sender?.rID && r.target?.rID === target?.rID);
}
function getRequest(sender, target) {
    return requests.find((r) => r.sender?.rID === sender?.rID && r.target?.rID === target?.rID);
}
