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
import { system, world } from '@minecraft/server';
import { textToAscii, asciiToText } from './Paragraphs/ConvertersParagraphs.js';
import Server from './ServerPaper.js';
import quick from '../quick.js';
/*
 * Welcome to the DatabasePaper!
 * Main Developer: Mo9ses
 * Sub developer: Nobady!
 * Link to name: Database Paper
*/
try {
    world.getDimension('overworld').runCommandAsync(`scoreboard objectives add "DB:model" dummy`);
}
catch { }
;
class DatabasePaper {
    /**
     * Creates a raw scoreboard database that uses player names and number values
     * @param table The table
     * @returns {registry}
     */
    async registry(file) {
        try {
            await world.getDimension('overworld').runCommandAsync(`scoreboard objectives add "${file}" dummy`);
        }
        catch { }
        return new registry(file);
    }
    /**
     * This registers or creates a table inside a database. The database's name will be the identifier
     * @param table Table name for the database
     * @param identifier The database name
     * @returns {database}
     */
    async register(table, identifier) {
        if (!identifier)
            identifier = '';
        if (identifier === 'DB')
            throw Error('You cannot create a database with the identifier "DB"');
        if (table === 'model')
            throw Error('You cannot create a database with the table "model"');
        if (table.includes(':') || identifier.includes(':'))
            throw Error(`The database "${table}" table name or identifier cannot include a ":"`);
        Server.queueCommand(`scoreboard players set "${identifier}" "DB:model" 0`);
        try {
            await world.getDimension('overworld').runCommandAsync(`scoreboard objectives add "DB:${identifier}" dummy`);
            await world.getDimension('overworld').runCommandAsync(`scoreboard objectives add "${identifier}:${table}" dummy`);
        }
        catch { }
        ;
        Server.queueCommand(`scoreboard players set "${table}" "DB:${identifier}" 0`);
        return new database(`${identifier}:`, table);
    }
    /**
     * Checks if the world has a database
     * @param table The name of the table
     * @param identifier The identifier
     * @returns {boolean}
     */
    has(table, identifier) {
        return Boolean(world.scoreboard.getObjective(`${identifier ?? ''}:${table}`)?.id);
    }
    /**
     * Drops a table
     * @returns {void} returns nothing
     * @example .drop('Bruh', 'MEMES');
     */
    drop(table, identifier) {
        if (!identifier)
            identifier = '';
        Server.queueCommand(`scoreboard players reset "${table}" "DB:${identifier}"`);
        try {
            world.scoreboard.removeObjective(`${identifier}:${table}`);
        }
        catch { }
        ;
        if (this.allTables(identifier).length === 1) {
            Server.queueCommand(`scoreboard players reset "${identifier}" "DB:model"`);
            try {
                world.scoreboard.removeObjective(`DB:${identifier}`);
            }
            catch { }
            ;
        }
        delete memory[`${identifier}:${table}`];
    }
    /**
     * List all of the registered tables
     * @param {string} identifier List all of the tables with a specific identifier
     * @returns {string[] | { id: string[] }}
     */
    allTables(identifier) {
        if (identifier) {
            if (!world.scoreboard.getObjective(`DB:${identifier}`))
                return [];
            return world.scoreboard.getObjective(`DB:${identifier}`).getParticipants().map(p => p.displayName);
        }
        const IDs = {};
        world.scoreboard.getObjective('DB:model').getParticipants().map(p => p.displayName).forEach(i => Object.assign(IDs, { [i]: world.scoreboard.getObjective(`DB:${i}`).getParticipants().map(p2 => p2.displayName) }));
        return IDs;
    }
}
const Database = new DatabasePaper();
export default Database;
const regMemory = {};
class registry {
    /**
     * Creating a objective
     * @param file The file
     */
    constructor(file) {
        this.file = file;
        if (regMemory.hasOwnProperty(file))
            return;
        Object.assign(regMemory, { [file]: [{}, new Date().getMinutes() + quick.release] });
        for (const score of world.scoreboard.getObjective(file).getScores())
            regMemory[file][0][score.participant.displayName] = score.score;
    }
    /**
     * Save a value or update a value in the registry under a key
     * @param {string} key The key you want to save the value as
     * @param {number} value The number value you want to save
     * @example .write('Test Key', 1);
     * @returns {this}
     */
    write(key, value) {
        regMemory[this.file][0][key] = value;
        Server.queueCommand(`scoreboard players set "${key}" "${this.file}" ${value}`);
        return this;
    }
    /**
     * Save value(s) or update value(s) in the registry under key(s)
     * @param {{ [key: string]: number }} data data?
     * @example .writeMany({ 'bro': 1, nice1: 25 });
     * @returns {this}
     */
    writeMany(data) {
        Object.keys(data).forEach(key => {
            regMemory[this.file][0][key] = data[key];
            Server.queueCommand(`scoreboard players set "${key}" "${this.file}" ${data[key]}`);
        });
        return this;
    }
    /**
     * Add or subtract a number to a key's value
     * @param {string} key The key you want to save the value as
     * @param {number} value The number value you want to save
     * @example .write('Test Key', 1);
     * @returns {this}
     */
    shift(key, value) {
        regMemory[this.file][0][key] = regMemory[this.file][0][key] + value ?? 1;
        Server.queueCommand(`scoreboard players add "${key}" "${this.file}" ${value}`);
        return this;
    }
    /**
     * Get the value of the key
     * @param {string} key
     * @example .read('Test Key');
     * @returns {number}
     */
    read(key, stringify) {
        if (stringify)
            return (regMemory[this.file][0].hasOwnProperty(key) ? String(regMemory[this.file][0][key]) : undefined);
        return (regMemory[this.file][0][key]);
    }
    /**
     * Get the value of many keys
     * @param {string[]} keys
     * @example .readMany(['Test Key', 'Sweater Weather']);
     * @returns {any[]}
     */
    readMany(keys, stringify) {
        return keys.map(key => {
            if (stringify)
                regMemory[this.file][0].hasOwnProperty(key) ? String(regMemory[this.file][0][key]) : undefined;
            return regMemory[this.file][0][key];
        });
    }
    /**
     * Check if the key exists in the file
     * @param {string} key
     * @example .has('Test Key');
     * @returns {boolean}
     */
    has(key) {
        return regMemory[this.file][0].hasOwnProperty(key);
    }
    /**
     * Delete a key from the table
     * @param {string} key
     * @example .delete('Test Key');
     * @returns {this}
     */
    delete(key) {
        delete regMemory[this.file][0][key];
        Server.queueCommand(`scoreboard players reset "${key}" "${this.file}"`);
        return this;
    }
    /**
     * Delete the key from the table
     * @param {string[]} keys
     * @returns {database}
     * @example .deleteMany('Test Key');
     */
    deleteMany(keys) {
        for (const k of keys) {
            delete regMemory[this.file][0][k];
            Server.queueCommand(`scoreboard players reset "${k}" "${this.file}"`);
        }
        return this;
    }
    /**
     * Deletes every key along their corresponding value in the registry file
     * @example .clear();
     * @returns {this}
     */
    clear() {
        delete regMemory[this.file];
        try {
            world.getDimension('overworld').runCommandAsync(`scoreboard objectives remove "${this.file}" dummy`);
        }
        catch { }
        ;
        try {
            world.getDimension('overworld').runCommandAsync(`scoreboard objectives add "${this.file}" dummy`);
        }
        catch { }
        ;
        return this;
    }
    /**
     * Gets all the keys in the registry
     * @example .allKeys();
     * @returns {string[]} A array with all the keys
     */
    allKeys() {
        return Object.keys(regMemory[this.file][0]);
    }
    /**
     * Gets all the of values for each key in the registry
     * @example .allValues();
     * @returns {number[]} A array with all the values
     */
    allValues() {
        return Object.values(regMemory[this.file][0]);
    }
    /**
     * Find a the first key assigned to said value
     * @param {number} value The number value
     * @example .find(893724);
     * @returns {string} The key
     */
    find(value) {
        return Object.keys(regMemory[this.file][0]).find(k => regMemory[this.file][0][k] === value);
    }
    /**
     * Find any key assigned to said value
     * @param {number} value The number value
     * @example .find(897232);
     * @returns {string[]} The keys
     */
    findMany(value) {
        return Object.keys(regMemory[this.file][0]).filter(k => regMemory[this.file][0][k] === value);
    }
    /**
     * Gets every key along their corresponding number value in the registry
     * @example .getCollection();
     * @returns {{ [key: string | number]: number }}
     */
    getCollection() {
        return regMemory[this.file][0];
    }
}
const memory = {};
class database {
    /**
     * Creating a database!
     * @param table The name of the table
     * @param identifier The database name. Used like this "id:table"
     */
    constructor(identifier, table) {
        this.table = table;
        this.fullName = `${identifier}${table}`;
        if (!memory.hasOwnProperty(this.fullName))
            Object.assign(memory, { [this.fullName]: {} });
    }
    /**
     * Save a value or update a value in the Database under a key
     * @param {string} key The key you want to save the value as
     * @param {any} value The value you want to save. If you type null, it will not take any space
     * @example .write('Test Key', 'Test Value');
     * @returns {this}
     */
    write(key, value) {
        Object.assign(memory[this.fullName], { [key]: [value, new Date().getMinutes() + quick.release] });
        let valueL = world.scoreboard.getObjective(this.fullName).getScores().filter(p => p.participant.displayName.startsWith(key) && p.score !== 0).length + 1, j = 1;
        const data = textToAscii(JSON.stringify(value));
        if (valueL > data.length)
            for (let l = 1; l < valueL; l++)
                Server.queueCommand(`scoreboard players reset "${key}=${l}" "${this.fullName}"`);
        for (const hex of data)
            Server.queueCommand(`scoreboard players set "${key}=${j}" "${this.fullName}" ${hex}`), j++;
        Server.queueCommand(`scoreboard players set "${key}" "${this.fullName}" 0`);
        return this;
    }
    /**
     * Save value(s) or update value(s) in the Database under key(s)
     * @param {{ [key: string]: any }} data data?
     * @example .writeMany({ 'bro': 1, nice1: 'huh?' });
     * @returns {this}
     */
    writeMany(data) {
        const scores = world.scoreboard.getObjective(this.fullName).getScores(), keys = Object.keys(data);
        for (const k of keys) {
            let j = 1;
            Object.assign(memory[this.fullName], { [k]: [data[k], new Date().getMinutes() + quick.release] });
            const valueL = scores.filter(p => p.participant.displayName.startsWith(k) && p.score !== 0).length + 1, value = textToAscii(JSON.stringify(data[k]));
            if (valueL > value.length)
                for (let l = 1; l < valueL; l++)
                    Server.queueCommand(`scoreboard players reset "${k}=${l}" "${this.fullName}"`);
            for (const hex of value)
                Server.queueCommand(`scoreboard players set "${k}=${j}" "${this.fullName}" ${hex}`), j++;
            Server.queueCommand(`scoreboard players set "${k}" "${this.fullName}" 0`);
        }
        return this;
    }
    /**
     * Get the value of the key
     * @param {string} key
     * @example .read('Test Key');
     * @returns {any}
     */
    read(key) {
        if (memory[this.fullName].hasOwnProperty(key)) {
            memory[this.fullName][key][1] = new Date().getMinutes() + quick.release;
            return memory[this.fullName][key][0];
        }
        const scores = world.scoreboard.getObjective(this.fullName).getScores().filter(p => p.participant.displayName.replace(/=\d+/g, '') === key && p.score != 0).map(s => [Number(s.participant.displayName.replace(`${key}=`, '')), s.score]).sort((a, b) => a[0] - b[0]).map(s => s[1]);
        const value = scores.length ? JSON.parse(asciiToText(scores)) : undefined;
        Object.assign(memory[this.fullName], { [key]: [value, new Date().getTime()] });
        return value;
    }
    /**
     * Get the value of many keys
     * @param {string[]} keys
     * @example .readMany(['Test Key', 'Rod Wave']);
     * @returns {any[]}
     */
    readMany(keys) {
        const scores = world.scoreboard.getObjective(this.fullName).getScores();
        return keys.map(k => {
            if (memory[this.fullName].hasOwnProperty(k)) {
                memory[this.fullName][k][1] = new Date().getMinutes() + quick.release;
                return memory[this.fullName][k][0];
            }
            const score = scores.filter(p => p.participant.displayName.replace(/=\d+/g, '') === k && p.score != 0).map(s => [Number(s.participant.displayName.replace(`${k}=`, '')), s.score]).sort((a, b) => a[0] - b[0]).map(s => s[1]);
            const value = score.length ? JSON.parse(asciiToText(score)) : undefined;
            Object.assign(memory[this.fullName], { [k]: [value, new Date().getTime()] });
            return value;
        });
    }
    /**
     * Check if the key exists in the table
     * @param {string} key
     * @example .has('Test Key');
     * @returns {boolean}
     */
    has(key) {
        if (memory[this.fullName].hasOwnProperty(key) && memory[this.fullName][key][0] !== undefined)
            return true;
        return world.scoreboard.getObjective(this.fullName)?.getScores().some(s => s.score === 0 && s.participant.displayName === key);
    }
    /**
     * Delete a key from the table
     * @param {string} key
     * @example .delete('Test Key');
     * @returns {this}
     */
    delete(key) {
        delete memory?.[this.fullName]?.[key];
        let length = world.scoreboard.getObjective(this.fullName).getScores().filter(p => p.participant.displayName.startsWith(key)).length + 1;
        for (let l = 1; l < length; l++)
            Server.queueCommand(`scoreboard players reset "${key}=${l}" "${this.fullName}"`);
        Server.queueCommand(`scoreboard players reset "${key}" "${this.fullName}"`);
        return this;
    }
    /**
     * Delete the key from the table
     * @param {string[]} keys
     * @returns {database}
     * @example .deleteMany('Test Key');
     */
    deleteMany(keys) {
        const scores = world.scoreboard.getObjective(this.fullName).getScores();
        for (const k of keys) {
            delete memory[this.fullName][k];
            let length = scores.filter(p => p.participant.displayName.startsWith(k)).length + 1;
            for (let l = 1; l < length; l++)
                Server.queueCommand(`scoreboard players reset "${k}=${l}" "${this.fullName}"`);
            Server.queueCommand(`scoreboard players reset "${k}" "${this.fullName}"`);
        }
        return this;
    }
    /**
     * Deletes every key along their corresponding value in the Database
     * @example .clear();
     * @returns {database}
     */
    clear() {
        try {
            world.getDimension('overworld').runCommandAsync(`scoreboard objectives remove "${this.fullName}" dummy`);
        }
        catch { }
        ;
        try {
            world.getDimension('overworld').runCommandAsync(`scoreboard objectives add "${this.fullName}" dummy`);
        }
        catch { }
        ;
        return this;
    }
    /**
     * Gets all the  keys in the table
     * @example .allKeys();
     * @returns {string[]} A array with all the keys
     */
    allKeys() {
        return world.scoreboard.getObjective(this.fullName).getScores().filter(s => s.score === 0).map(n => n.participant.displayName);
    }
    /**
     * Gets all the of keys in the table then gets their value
     * @example .allValues();
     * @returns {string[]} A array with all the values
     */
    allValues() {
        const allKeys = this.allKeys();
        if (!allKeys?.length)
            return [];
        return this.readMany(allKeys);
    }
    /**
     * Gets every key along their corresponding value in the Database
     * @example .getCollection();
     * @returns {object} { [key]: value }
     */
    getCollection() {
        const allKeys = this.allKeys(), allValues = this.readMany(allKeys), collection = {};
        allKeys.forEach((key, i) => Object.assign(collection, { [key]: allValues[i] }));
        return collection;
    }
    /**
     * Runs a forEach loop on every key in the database
     * @param callback The function you want to run on the keys
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
     * Re-maps every key in the database
     * @param callback The function you want to run on the keys
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
                return this.write(v[0], v[1]);
            }
            return this.write(oldKey, v[1]);
        });
        return this;
    }
}
//Memory release system
system.runInterval(() => {
    if (system.currentTick < 50)
        return;
    const minute = new Date().getMinutes();
    Object.keys(memory).forEach(table => Object.keys(memory[table]).forEach(key => {
        if (memory[table][key][1] >= 5 && memory[table][key][1] > minute)
            return;
        delete memory[table][key];
    }));
}, 1200);
