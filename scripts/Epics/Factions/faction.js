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
import { ID } from "../../Papers/paragraphs/ExtrasParagraphs.js";
import { connected } from '../../Tales/playerConnect.js';
import { fac } from './main.js';
import Database from "../../Papers/DatabasePaper.js";
import quick from "../../quick.js";
const config = quick.epics.Factions;
/**
 * Create faction
 * @param {playerType} player creator of the faction
 * @param {string} name faction name
 * @returns {boolean}
 */
export function createFaction(player, name) {
    if (has({ player: player }))
        return player.error('You are already in a faction!');
    if (has({ name: name }))
        return player.error(`There already is a faction with the name "§6${name}§e".`);
    if (name.length > 9)
        return player.error('Your faction name cannot be longer than 9 characters.');
    if (config.createPrice) {
        if (player.getScore(config.obj) < config.createPrice)
            return player.error('You don\'t have enough money to create a faction.');
        player.send(`§eYou lost §6${config.createPrice} §efor creating a new faction`);
        player.runCommandAsync(`scoreboard players remove @s "${config.obj}" ${config.createPrice}`);
    }
    const id = ID(), power = player.getScore(config.powerObj), time = new Date().getTime();
    Database.register(id, 'FTN').writeMany({
        n: name,
        d: '',
        o: Number(config.defaultOpen),
        m: 1,
        a: [],
        c: time,
        s: [],
        cc: [],
        u0: [connected[player.name][2], player.name, 2, power, time] //members (owner will be the first member) m0
    });
    fac.value.write(name, 0);
    fac.kills.write(name, 0);
    fac.power.write(name, 0);
    fac.names.write(name, Number(id));
    fac.player.write(player.rID, Number(id));
    fac.playerI.write(player.rID, 0);
    player.send(`The "§6${name}§r§e" faction has been created! Now you can claim land`);
}
/**
 * Delete player's faction
 * @param {PlayerType} player player whose faction will be removed
 * @returns {boolean}
 */
export function deleteFaction(player) {
    const name = 'Mo9ses';
    const isPlayer = world.getAllPlayers().some(p => p.name === name);
    if (!has({ player: player }))
        return player.error('How are you going to delete your faction if you\'re not even in one?', 'FTN');
    const faction = get({ player: player });
    if (faction.u0.id !== player.rID)
        return player.send('You can\'t delete a faction if you are not the owner.', 'FTN');
    player.runCommandAsync(`scoreboard players add @s "${config.obj}" ${faction.bank}`);
    faction.members.forEach(m => {
        faction.claims.forEach(c => fac.chunks.delete(`${c[0]}_${c[1]}`));
        fac.player.delete(m.id);
        fac.playerI.delete(m.id);
    });
    fac.value.delete(faction.name);
    fac.power.delete(faction.name);
    fac.kills.delete(faction.name);
    fac.names.delete(faction.name);
    Database.drop(faction.id, 'FTN');
    player.send('You have successfully deleted your faction!', 'FTN');
}
export function has({ name, id, player }) {
    if (id)
        return Database.has(id, 'FTN');
    if (name)
        return fac.names.has(name);
    if (player)
        return Boolean(fac.player.read(connected[player.name]?.[2]));
}
export function find({ name, id, player }) {
    let realID;
    if (id)
        realID = id;
    if (name)
        realID = String(fac.names.read(name));
    if (player)
        realID = String(fac.player.read(connected[player.name]?.[2]));
    if (realID && Database.has(realID, 'FTN'))
        return realID;
}
export function get({ name, id, player }) {
    const realID = find({ name, id, player });
    if (!realID)
        return;
    const db = Database.register(realID, 'FTN').getCollection(), members = [];
    Object.keys(db).filter(key => key.startsWith('u')).forEach(u => {
        const user = db[`u${u.replace('u', '')}`];
        members.push({
            id: user[0],
            name: user[1],
            role: user[2] === 2 ? 'owner' : user[2] ? 'admin' : 'member',
            power: user[3],
            joinDate: user[4],
        });
    });
    return {
        id: realID,
        name: db.n,
        description: db.d,
        open: Boolean(db.o),
        members: members,
        claims: db.cc,
        power: fac.power.read(db.n),
        bank: fac.value.read(db.n),
        kills: fac.kills.read(db.n),
        allies: db.a,
        created: db.c,
        spawn: db.s,
        u0: members.find(m => m.role === 'owner')
    };
}
export function readProperty({ name, id, player } = {}, property) {
    const realID = find({ name, id, player });
    if (!realID)
        return;
    return Database.register(realID, 'FTN').read(property);
}
export function writeProperty({ name, id, player } = {}, key, value) {
    const realID = find({ name, id, player });
    if (!realID)
        return;
    Database.register(realID, 'FTN').write(key, value);
}
export function getRole(player, db) {
    const realID = find({ player });
    if (!realID)
        return 'member';
    if (!db)
        db = Database.register(realID, 'FTN');
    const role = db.read(`u${fac.playerI.read(connected[player.name]?.[2])}`)?.[2];
    if (!role)
        return 'member';
    return role === 2 ? 'owner' : 'admin';
}
