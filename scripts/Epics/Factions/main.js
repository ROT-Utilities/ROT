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
import { world } from '@minecraft/server';
import { addListener } from '../../Tales/main.js';
import Database from "../../Papers/DatabasePaper.js";
import Player from '../../Papers/PlayerPaper.js';
import quick from '../../quick.js';
//Make a faction entity where you can easily edit the faction
export const config = quick.epics.Factions;
export const fac = {
    chunks: Database.registry('FTNclaims'),
    names: Database.registry('FTNnames'),
    player: Database.registry('playerFTN'),
    playerC: Database.registry('playerFTNc'),
    playerI: Database.registry('playerFTNi'),
    power: Database.registry('FTNpower'),
    value: Database.registry('FTNvalue'),
    kills: Database.registry('FTNkills'),
    invites: [],
};
addListener('playerConnect', res => Player.memory(res).write('FTNtimer', Date.now() + 3600000));
try {
    world.scoreboard.addObjective(config.obj, config.obj);
}
catch { }
;
import('./chunk/place.js');
import('./chunk/break.js');
import('./power.js');
import('./interval.js');
import('./command.js');
