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
import { DM } from "./main.js";
import Player from "../../Papers/PlayerPaper.js";
system.runInterval(() => {
    if (!DM?.config || system.currentTick < 20)
        return;
    world.getAllPlayers().forEach(player => {
        if (!player.hasTag(DM.config.tag))
            return;
        player.removeTag(DM.config.tag);
        DM.open(Player.playerType(player, { from: 'DTR', sound: false }));
    });
}, 40);
