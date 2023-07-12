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
import { MinecraftBlockTypes, Player as IPlayer, world, system } from "@minecraft/server";
import { connected } from "../../../Tales/playerConnect.js";
import { getOwner, showBorder } from "./claim.js";
import { fac } from "../main.js";
import Player from "../../../Papers/PlayerPaper.js";
world.afterEvents.blockPlace.subscribe(res => {
    if (Player.getGamemode(res.player) === 'creative')
        return;
    const block = res.block;
    if (fac.config.blockObi && block.typeId === MinecraftBlockTypes.obsidian.id)
        return res.block.setType(MinecraftBlockTypes.air);
    const chunk = [~~((block.location.x + 1) / 16), ~~((block.location.z + 1) / 16)];
    if (!fac.chunks.has(`${chunk[0]}_${chunk[1]}`))
        return;
    const owner = getOwner(chunk);
    if (owner === `${fac.player.read(connected[res.player.name].rID)}`)
        return;
    Player.send(res.player, `§cYou cannoct place blocks in this chunk because a faction is protecting it.`, 'FTN');
    showBorder(res.player, chunk, res.block.location.y, false);
    res.block.setType(MinecraftBlockTypes.air);
    res.player.runCommandAsync(`give @s ${res.block.typeId}`);
});
const rate = {};
world.beforeEvents.itemUseOn.subscribe(res => {
    if (!(res.source instanceof IPlayer) || Player.getGamemode(res.source) === 'creative')
        return;
    if (rate.hasOwnProperty(res.source.name))
        return res.cancel = true;
    const block = res.source.dimension.getBlock(Player.veiwBlock(res.source)), chunk = [~~((block.location.x + 1) / 16), ~~((block.location.z + 1) / 16)];
    if (!fac.chunks.has(`${chunk[0]}_${chunk[1]}`))
        return;
    const owner = getOwner(chunk);
    if (owner === `${fac.player.read(connected[res.source.name].rID)}`)
        return;
    if ((block.typeId.endsWith('door') || block.typeId.endsWith('button') || block.typeId === MinecraftBlockTypes.lever.id))
        return;
    Player.send(res.source, `§cYou cannoct interact with this chunk because a faction is protecting it.`, 'FTN');
    rate[res.source.name] = new Date().getTime() + 5000;
    showBorder(res.source, chunk, res.source.location.y, false);
    res.cancel = true;
});
system.runInterval(() => Object.keys(rate).forEach(r => new Date().getTime() > rate[r] && delete rate[r]), 20);
