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
import { world, system } from "@minecraft/server";
import Player from '../../Papers/PlayerPaper.js';
import { create } from './forms/create.js';
system.runInterval(async () => {
    for (const plr of world.getPlayers()) {
        const player = Player.playerType(plr);
        if (!player.hasTag('slapper_create'))
            return;
        player.removeTag('slapper_create');
        return create(player);
    }
}, 20);
/**
 * IMPORT EVENTS
*/
import './Slap.js';
import './Edit.js';
import './Kill.js';
