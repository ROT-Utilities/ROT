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
import { system, world } from "@minecraft/server";
import { openMT } from "./main.js";
import Player from "../../Papers/PlayerPaper.js";
import quick from "../../quick.js";
const config = quick.epics['Money Transfer'];
let color = 0;
system.runInterval(() => {
    if (config.tag.length)
        world.getAllPlayers().forEach(player => {
            if (!player.hasTag(config.tag) || !Player.isConnected(player))
                return;
            player.removeTag(config.tag);
            openMT(Player.playerType(player, { from: config.npcName, sound: false }));
        });
    if (!config.coolHouseNames)
        return;
    if (color > config.houseName.length)
        color = 0;
    else
        color++;
    let name = config.houseName.split('');
    name.splice(color, 0, config.color3);
    name.splice(color + 2, 0, config.color2);
    name.splice(color + 4, 0, config.color1);
    color !== 0 && name.splice(color - 1, 0, config.color2);
    name = '§l' /*§r*/ + config.color1 + name.join('');
    for (const dim of ['overworld', 'nether', 'the end'])
        Array.from(world.getDimension(dim).getEntities({ type: 'rot:mt' })).forEach(entity => entity.nameTag = name);
}, 5);
