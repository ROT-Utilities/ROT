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
import { ID, setTickInterval } from '../Papers/paragraphs/ExtrasParagraphs.js';
import { listeners } from './main.js';
import Database from '../Papers/DatabasePaper.js';
import Player from '../Papers/PlayerPaper.js';
export const connected = {};
try {
    world.scoreboard.addObjective('PLRid', '');
}
catch { }
;
/**
 * The join function
 * @param {player} player The player
 */
function join(player) {
    if (!player)
        return;
    const nameReg = Database.registry('PLRname'); //, koolReg = Database.registry('PLRkool');
    //Add last joined. Haven't join in 6 months gone
    let id = world.scoreboard.getObjective('PLRid').getScores().find(p => p.participant.displayName === player.name)?.score;
    if (!id) {
        if (nameReg.has(`$${player.name}`))
            id = nameReg.read(`$${player.name}`);
        else
            id = Number(ID());
        player.runCommandAsync(`scoreboard players set @s PLRid ${id}`);
    }
    else
        nameReg.delete(Object.entries(nameReg.getCollection()).find(a => a[1] === id)[0]);
    nameReg.write(`$${player.name}`, id);
    const db = Database.register(String(id), 'PLR');
    Object.assign(connected, { [player.name]: [db, {}, String(id)] });
    listeners.forEach(event => {
        if (event[0] !== 'playerConnect')
            return;
        try {
            event[1](player);
        }
        catch { }
        ;
    });
    if (Player.isAdmin(player))
        return;
    if (!db.has('warns'))
        db.write('warns', 0);
}
world.events.playerLeave.subscribe(data => leave(data.playerName));
/**
 * The leave function
 * @param name Name?
 */
function leave(name) {
    connected[name].push(Date.now() + 3600000);
    listeners.forEach(event => {
        if (event[0] !== 'playerDisconnect')
            return;
        try {
            event[1](name);
        }
        catch { }
        ;
    });
}
/**
 * Timer?
 */
setTickInterval(() => {
    const keys = Object.keys(connected);
    keys.forEach(p => connected[p][3] && connected[p][3] < Date.now() && delete connected[p]);
    world.getAllPlayers().filter(p => !keys.includes(p.name)).forEach(p => join(p));
}, 25, false);
