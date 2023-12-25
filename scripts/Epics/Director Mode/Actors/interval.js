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
import { ACT } from "./main.js";
import { DM } from "../main.js";
system.runInterval(() => Array.from(world.getDimension('overworld').getEntities({ type: 'rot:actor' })).forEach(async (entity) => {
    if (system.currentTick < 20)
        return;
    const rID = entity.getTags().find(tag => tag.startsWith('rID:'))?.slice(4);
    if (!rID || !ACT.actors.hasOwnProperty(rID))
        return;
    entity.getComponent('minecraft:scale').value = ACT.actors[rID]?.[2] ?? 1;
    if (ACT.actors[rID].length !== 4 || ACT.actors[rID]?.[3])
        return;
    entity.playAnimation(Object.values(DM.config.Actors.actions)[ACT.actors[rID]?.[1] ?? 0], { nextState: Object.values(DM.config.Actors.actions)[ACT.actors[rID]?.[1] ?? 0] });
    ACT.actors[rID][3] = true;
}), 40);
