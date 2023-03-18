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
import Player from "../../Papers/PlayerPaper.js";
import quick from "../../quick.js";
const config = quick.epics.Slappers;
world.events.entityHit.subscribe(res => {
    if (!(res.entity instanceof IPlayer))
        return;
    const player = res.entity;
    const slapper = res.hitEntity;
    const inv = player.getComponent('inventory').container, item = inv.getItem(player.selectedSlot);
    if (item && (item?.typeId === config.editItem[0] && item?.nameTag === config.editItem[1]) || (item?.typeId === config.killItem[0] && item?.nameTag === config.killItem[1]))
        return;
    if (!res.hitEntity)
        return;
    if (!res.hitEntity.hasTag('isSlapper'))
        return;
    try {
        console.log(slapper.getTags().find(tag => tag.startsWith('cmd:'))?.substring(4));
        player.runCommandAsync(slapper.getTags().find(tag => tag.startsWith('cmd:'))?.substring(4));
    }
    catch {
        Player.error(player, 'An error occurred while trying to execute the command', 'Slappers');
    }
});
