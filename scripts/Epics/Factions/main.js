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
import { world } from '@minecraft/server';
import { addListener } from '../../Tales/main.js';
import Database from "../../Papers/DatabasePaper.js";
import Player from '../../Papers/PlayerPaper.js';
import quick from '../../quick.js';
//Make a faction entity where you can easily edit the faction
export let fac = {
    config: quick.epics.Factions,
    chunks: null,
    names: null,
    player: null,
    playerC: null,
    playerI: null,
    power: null,
    value: null,
    kills: null,
    invites: []
};
(async function () {
    fac.chunks = await Database.registry('FTNclaims');
    fac.names = await Database.registry('FTNnames');
    fac.player = await Database.registry('playerFTN');
    fac.playerC = await Database.registry('playerFTNc');
    fac.playerI = await Database.registry('playerFTNi');
    fac.power = await Database.registry('FTNpower');
    fac.value = await Database.registry('FTNvalue');
    fac.kills = await Database.registry('FTNkills');
})();
addListener('playerConnect', res => Player.memory(res).write('FTNtimer', Date.now() + 3600000));
try {
    world.getDimension('overworld').runCommandAsync(`scoreboard objectives add "${fac.config.obj}" dummy`);
}
catch { }
;
try {
    world.getDimension('overworld').runCommandAsync(`scoreboard objectives add "${fac.config.powerObj}" dummy`);
}
catch { }
;
import('./chunk/place.js');
import('./chunk/break.js');
import('./power.js');
import('./interval.js');
import('./command.js');
