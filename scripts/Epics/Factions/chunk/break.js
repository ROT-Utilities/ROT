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
Website: https://www.rotmc.ml
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Thank you!
*/
import { Player as IPlayer, world } from "@minecraft/server";
import { connected } from "../../../Tales/playerConnect.js";
import { getOwner, showBorder } from "./claim.js";
import { fac } from "../main.js";
import Player from "../../../Papers/PlayerPaper.js";
import quick from "../../../quick.js";
import { sleep } from "../../../Papers/paragraphs/ExtrasParagraphs.js";
world.events.blockBreak.subscribe((res) => {
    if (Player.getGamemode(res.player) === 'creative' || quick.epics.Factions.containers.includes(res.brokenBlockPermutation.type.id))
        return;
    const chunk = [~~((res.block.location.x + 1) / 16), ~~((res.block.location.z + 1) / 16)];
    if (!fac.chunks.has(`${chunk[0]}_${chunk[1]}`))
        return;
    const owner = getOwner(chunk);
    if (owner === `${fac.player.read(connected[res.player.name]?.[2])}`)
        return;
    Player.send(res.player, `§cYou cannoct place blocks in this chunk because a faction is protecting it.`, 'FTN');
    res.block.setPermutation(res.brokenBlockPermutation);
    res.player.runCommandAsync('kill @e[type=item, r=8]');
});
world.events.entityHit.subscribe(res => {
    if (!res.hitBlock || !(res.entity instanceof IPlayer) || Player.getGamemode(res.entity) === 'creative')
        return;
    if (quick.epics.Factions.containers.includes(res.hitBlock.type.id))
        return;
    const chunk = [~~((res.hitBlock.location.x + 1) / 16), ~~((res.hitBlock.location.z + 1) / 16)];
    if (!fac.chunks.has(`${chunk[0]}_${chunk[1]}`))
        return;
    const owner = getOwner(chunk);
    if (owner === `${fac.player.read(connected[res.entity.name]?.[2])}`)
        return;
    Player.send(res.entity, `§cYou cannoct place blocks in this chunk because a faction is protecting it.`, 'FTN');
    showBorder(res.entity, chunk, res.hitBlock.location.y, false);
    res.entity.runCommandAsync('gamemode a').then(async () => {
        await sleep(60);
        res.entity.runCommandAsync('gamemode s');
    });
});
