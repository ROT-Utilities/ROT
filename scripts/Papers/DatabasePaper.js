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
© Copyright 2022 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Website: https://www.rotmc.ml
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Thank you!
*/
import { textToHex, hexToText } from './paragraphs/ConvertersParagraphs.js';
import { world } from '@minecraft/server';
import Server from '../ServerBook.js';
import config from '../config.js';
/*
 * Welcome to the DatabasePaper!
 * Main Developer: Mo9ses
 * Sub developer: Nobady!
 * Link to name: Database Paper
*/
export class DatabasePaper {
    constructor(table, identifier) {
        const id = identifier || 'ROT';
        if ((id + table).length > 16)
            throw Error('[Database] constructor(): Error - The table name is too long!');
        try {
            world.scoreboard.addObjective(id + table, '');
        }
        catch (_a) { }
        ;
        this.fullName = id + table;
        this.table = table;
    }
    /**
     * Get key score for a fake player on the database
     * @param {string} key The name of the fake player
     * @returns {number} A number int
     * @example .getScore('ROTidk');
     */
    getScore(key) {
        let value = 0;
        Server.runCommand(`scoreboard players test "${key}" "${this.fullName}" -1 -1`).catch(e => value = e ? parseInt(e.match(/\d+/)) : 0);
        return value;
    }
    /**
     * Save a value or update a value in the Database under a key
     * @param {string} key The key you want to save the value as
     * @param {any} value The value you want to save
     * @param {boolean} memoryKey You can save the key and call for it later using .getCollection();
     * @returns {database}
     * @example .write('Test Key', 'Test Value');
     */
    write(key, value, memoryKey) {
        var _a;
        let keyLength = this.getScore(key + 'L') + 1, j = 1, data = textToHex(JSON.stringify(value));
        for (let l = 1; l < keyLength; l++)
            Server.runCommand(`scoreboard players reset "${key + l}" "${this.fullName}"`);
        Server.runCommand(`scoreboard players set "${key}L" "${this.fullName}" ${data.length}`);
        for (const hex of data)
            Server.runCommand(`scoreboard players set "${key + j}" "${this.fullName}" ${hex}`), j++;
        if (!memoryKey)
            return this;
        if (!((_a = this.read(this.fullName)) === null || _a === void 0 ? void 0 : _a.includes(key)))
            this.write(this.fullName, this.has(this.fullName) ? [this.read(this.fullName), key].flat() : [key]);
        return this;
    }
    /**
     * Get the value of the key
     * @param {string} key
     * @returns {any}
     * @example .get('Test Key');
     */
    read(key) {
        const length = this.getScore(key + 'L') + 1, value = [];
        if (length === 1)
            return;
        for (let l = 1; l < length; l++)
            value.push(this.getScore(key + l));
        return JSON.parse(hexToText(value));
    }
    /**`
     * Check if the key exists in the table
     * @param {string} key
     * @returns {boolean}
     * @example .has('Test Key');
     */
    has(key) {
        return this.getScore(key + 'L') ? true : false;
    }
    /**
     * Delete the key from the table
     * @param {string} key
     * @returns {database}
     * @example .delete('Test Key');
     */
    delete(key) {
        var _a;
        let length = this.getScore(key + 'L') + 1;
        if (length === 1)
            return this;
        for (let l = 1; l < length; l++)
            Server.runCommand(`scoreboard players reset "${key + l}" "${this.fullName}"`);
        Server.runCommand(`scoreboard players reset "${key}L" "${this.fullName}"`);
        if (!((_a = this.read(this.fullName)) === null || _a === void 0 ? void 0 : _a.includes(key)))
            return this;
        const MemoryKeys = this.read(this.fullName);
        MemoryKeys.splice(MemoryKeys.findIndex(k => k === key), 1);
        MemoryKeys.length > 0 ? this.write(this.fullName, MemoryKeys) : this.delete(this.fullName);
        return this;
    }
    /**
     * Deletes every key along their corresponding value in the Database
     * @returns {database}
     * @example .clear();
     */
    clear() {
        try {
            world.scoreboard.removeObjective(this.fullName);
            world.scoreboard.addObjective(this.fullName, '');
        }
        catch (_a) { }
        ;
        return this;
    }
    /**
     * Drops the database
     * @returns {void} returns nothing
     * @example .drop();
     */
    drop() {
        world.scoreboard.removeObjective(this.fullName);
    }
    /**
     * Gets all the saved memory keys in the table
     * @returns {string[]} A array with all the keys
     * @example .allKeys();
     */
    allKeys() {
        return this.read(this.fullName);
    }
    /**
     * Gets all the saved memory keys in the table then gets their value
     * @returns {string[]} A array with all the values
     * @example .allValues();
     */
    allValues() {
        const allKeys = this.allKeys();
        if (!allKeys)
            return;
        return allKeys.map(key => this.read(key));
    }
    /**
     * Gets every memory key along their corresponding memory value in the Database
     * @returns {object} { [key]: value }
     * @example .getCollection();
     */
    getCollection() {
        const allKeys = this.allKeys(), collection = {};
        if (!allKeys)
            return;
        allKeys.forEach((key) => Object.assign(collection, { [key]: this.read(key) }));
        return collection;
    }
    /**
     * Runs a forEach loop on every memory key in the database
     * @param callback The function you want to run on the memory keys
     * @returns {database}
     * @example .forEach((key, value) => console.warn(key));
     */
    forEach(callback) {
        const collection = this.getCollection();
        try {
            Object.keys(collection).forEach(key => callback(key, collection[key]));
        }
        catch (e) {
            console.warn(e + e.stack);
        }
        return this;
    }
    /**
     * Re-maps every memory key in the database
     * @param callback The function you want to run on the memory keys
     * @returns {database}
     * @example .forEach((key, value) => { key, value + 1 });
     */
    map(callback) {
        const then = this.getCollection(), now = [];
        try {
            Object.keys(then).forEach(key => now.push(callback(key, then[key]) || undefined));
        }
        catch (e) {
            console.warn(e + e.stack);
        }
        now.forEach((v, i) => {
            if (!v.length)
                return;
            const oldKey = Object.keys(then)[i];
            if (v[0] != oldKey) {
                this.delete(oldKey);
                return this.write(v[0], v[1], true);
            }
            return this.write(oldKey, v[1], true);
        });
        return this;
    }
}
/**
 * Quick
 * This handles in game configuration
 */
const quick = config;
export default quick;
world.events.worldInitialize.subscribe(() => {
    const config = new DatabasePaper('config');
    if (!config.has('written')) {
    }
});
