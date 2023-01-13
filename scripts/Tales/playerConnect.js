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
import { setTickInterval } from '../Papers/paragraphs/ExtrasParagraphs.js';
import Database from '../Papers/DatabasePaper.js';
import Player from '../Papers/PlayerPaper.js';
//The joined player's and their DB table
export const joined = {};
world.events.playerJoin.subscribe(data => join(data.player));
/**
 * The join function
 * @param player The player
 */
function join(plr) {
    const player = Player.playerType(plr);
    const db = Database.register(player.id, 'PLR');
    Object.assign(joined, { [player.nameTag]: [db.table] });
    db.write('name', player.nameTag);
    if (player.isAdmin)
        db.delete('ban');
}
;
world.events.playerLeave.subscribe(data => leave(data.playerName));
/**
 * The leave function
 * @param name Name?
 */
function leave(name) {
    joined[name].push(new Date().getTime() + 3600000);
}
;
/**
 * Timer?
 */
setTickInterval(() => {
    const keys = Object.keys(joined);
    keys.forEach(p => joined[p][1] && joined[p][1] < new Date().getTime() && delete joined[p]);
    Array.from(world.getPlayers()).filter(p => !keys.includes(p.nameTag)).forEach(p => join(p));
}, 100);
