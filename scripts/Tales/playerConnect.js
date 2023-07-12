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
import { system, world } from '@minecraft/server';
import { ID } from '../Papers/Paragraphs/ExtrasParagraphs.js';
import { listeners } from './main.js';
import Database from '../Papers/DatabasePaper.js';
import quick from '../quick.js';
export const connected = {};
export let nameReg, dateReg;
(async function () {
    world.getDimension('overworld').runCommandAsync('scoreboard objectives add "PLRid" dummy');
    nameReg = await Database.registry('PLRname');
    dateReg = await Database.registry('PLRdate');
    system.runInterval(() => {
        if (system.currentTick < 50)
            return;
        const keys = Object.keys(connected);
        keys.forEach(p => {
            if (!connected[p]?.hasOwnProperty('release'))
                return delete connected?.[p];
            if (connected[p].release !== 0 && connected[p].release < Date.now())
                delete connected[p];
        });
        world.getAllPlayers().filter(p => !keys.includes(p.name)).forEach(p => join(p));
    }, 25);
})();
/**
 * The join function
 * @param {player} player The player
 */
function join(player) {
    if (!player?.nameTag)
        return;
    let id = world.scoreboard.getObjective('PLRid').getScores().find(p => p.participant.displayName === player.name)?.score;
    if (!id) {
        if (nameReg.has(`$${player.name}`))
            id = nameReg.read(`$${player.name}`);
        else
            id = Number(ID());
        player.runCommandAsync(`scoreboard players set @s PLRid ${id}`);
        dateReg.write(Date.now(), id);
    }
    else {
        const find = nameReg.find(id);
        if (find)
            nameReg.delete(find);
    }
    nameReg.write(`$${player.name}`, id);
    connected[player.name] = { memory: {}, rID: String(id), release: 0 };
    quick.logs.connectedLogs.push(connected[player.name]);
    listeners.forEach(event => {
        if (event[0] !== 'playerConnect')
            return;
        try {
            event[1](player);
        }
        catch { }
        ;
    });
}
world.afterEvents.playerLeave.subscribe(data => leave(data.playerName));
/**
 * The leave function
 * @param name Name?
 */
function leave(name) {
    if (!connected?.[name]?.release)
        return;
    connected[name].release = Date.now() + 3600000;
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
