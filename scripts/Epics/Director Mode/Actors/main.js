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
import { sleep } from "../../../Papers/Paragraphs/ExtrasParagraphs.js";
import Database from "../../../Papers/DatabasePaper.js";
world.afterEvents.entitySpawn.subscribe(async ({ entity }) => {
    await sleep(20);
    if (entity?.typeId !== 'rot:actor' || entity.getTags().length)
        return;
    entity.nameTag = '§6§lClick to assign roles';
    entity.triggerEvent('rot:load');
});
export const ACT = {
    actorREG: null,
    actors: {},
    load: async () => {
        ACT.actorREG = await Database.registry('DM:actors');
        const cmds = ACT.actorREG.getCollection();
        Object.keys(cmds).forEach(key => {
            const data = key.split('&-&'), parsed = JSON.parse(data[1].replace(/\$-\$/g, '"'));
            ACT.actors[data[0]] = [parsed[0].split(';'), parsed[1], parsed[2], false];
        });
    }
};
ACT.load();
import('./interval.js');
import('./hit.js');
