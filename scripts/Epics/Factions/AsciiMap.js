/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
Aex66 (Developer)
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
______________________________
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
import { compass } from "../../Papers/Paragraphs/ExtrasParagraphs.js";
import { getChunk, getOwner } from "./chunk/claim.js";
import { fac } from "./main.js";
import quick from "../../quick.js";
function AsciiCompass(angle) {
    let d1 = '§6\\ N / §r', d2 = '§6W + E §r', d3 = '§6/ S \\ §r', direction = compass(angle), corner = false;
    if (direction.includes('North') && direction.includes('West'))
        d1 = '§c\\ §6N / §r', corner = true;
    if (direction.includes('North') && direction.includes('East'))
        d1 = '§6\\ N§c / §r', corner = true;
    if (direction.includes('South') && direction.includes('West'))
        d3 = '§c/ §6S \\ §r', corner = true;
    if (direction.includes('South') && direction.includes('East'))
        d3 = '§6/ S §c\\ §r', corner = true;
    if (direction.includes('North') && !corner)
        d1 = '§6\\ §cN§6 / §r';
    if (direction.includes('West') && !corner)
        d2 = '§cW§6 + E §r';
    if (direction.includes('East') && !corner)
        d2 = '§6W + §cE §r';
    if (direction.includes('South') && !corner)
        d3 = '§6/ §cS §6\\ §r';
    return [d1, d2, d3];
}
export function AsciiMap(player, size = 9) {
    const compass = AsciiCompass(player.getRotation().y), inChunk = getChunk(player), inChunkID = Number(getOwner(inChunk)), factionNames = [];
    let map = [];
    if (size % 2 == 0)
        size++; // number cannot be even
    const start = { x: -Math.floor(size / 2), z: -Math.floor(size / 2) };
    for (let z = start.z; z < start.z + size; z++) { //Faction chunk, green. Allies, yellow. Enamy, red
        //Chunk is center code, else, i dunno
        for (let x = start.x; x < start.x + size; x++)
            if (inChunk[0] + x == inChunk[0] && inChunk[1] + z == inChunk[1])
                map.push("§b+ §r");
            else {
                const owner = getOwner([inChunk[0] + x, inChunk[1] + z]);
                if (owner)
                    if (factionNames.includes(owner))
                        map.push(`§a${String.fromCharCode(65 + factionNames.indexOf(owner))} `);
                    else {
                        //New faction store
                        factionNames.push(owner);
                        map.push(`§a${String.fromCharCode(65 + factionNames.length - 1)} `);
                    }
                else
                    map.push("§7- §r");
            }
        map.push('\n');
    }
    // map.push('\n');
    for (let i = 0; i < factionNames.length; i++)
        map.push(`${i === 0 ? '' : '\n'}§d${String.fromCharCode(65 + i)}§f = §e${fac.names.find(Number(factionNames[i]))}`);
    //Thanks to WavePlayz, he did all this math to make it possible to accommodate the compass!
    map.splice((size + 1) * 2, 3, compass[2]);
    map.splice((size + 1) * 1, 3, compass[1]);
    map.splice((size + 1) * 0, 3, compass[0]);
    map.unshift(`§6_____.[§2(${inChunk[0]}, ${inChunk[1]}) ${inChunkID ? fac.names.find(inChunkID) : 'The Wild'}§6]._____\n`);
    return map.join('');
}
system.runInterval(() => world.getAllPlayers().forEach(p => {
    if (!p.hasTag(quick.epics.Factions.autoTag))
        return;
    p.sendMessage(`${AsciiMap(p)}\n§a${quick.prefix}!f n§e to stop auto mapping.`);
}), quick.epics.Factions.autoTimer * 20);
