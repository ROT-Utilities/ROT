/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
notbeer (ROT's base code)
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
__________ ___________________
\______   \\_____  \__    ___/
 |       _/ /   |   \|    |   
 |    |   \/    |    \    |   
 |____|_  /\_______  /____|   
        \/         \/         
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
Â© Copyright 2022 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Website: https://www.rotmc.ml
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Thank you!
*/
import { ServerPaper } from './ServerPaper.js';
import { textToBinary, binaryToText, scoreToBinary } from './paragraphs/ConvertersParagraphs.js';
/*
 * Welcome to the Database Paper!
 * Main Developer: Mo9ses
 * Sub developer: notbeer
 * Link to name: DataBase Paper
*/
export class DatabasePaper {
    public readonly table: string;
    private readonly runCommand = new ServerPaper().runCommand;
    constructor( table: string ) {
        if(!table) throw Error('[Database] constructor(): Error - Provide a table name!');
        if(('ROTdb_' + table).length > 16) throw Error('[Database] constructor(): Error - The table name is too long!');
        this.table = table;
        this.runCommand(`scoreboard objectives add "ROTdb_${table}" dummy`);
    }
    /**
     * Get key score for a fake player on the database
     * @param {string} key The name of the fake player
     * @returns {number} A number int
     * @example .getScore('ROTidk');
     */
    public getScore(key: string): number {
        const data = this.runCommand(`scoreboard players test "${key}" "ROTdb_${this.table}" * *`);
        if(data.error) return 0;
        return parseInt(data.statusMessage.match(/-?\d+/)[0]);
    }
    /**
     * Use this to set a fake playor score in the table without using the database system
     * @param {string} key The name of the player
     * @param {number} value The int it will hold
     */
    public setScore(key: string, value: number): void {
        this.runCommand(`scoreboard players set "${key}" "ROTdb_${this.table}" ` + value);
    }
    /**
     * Save a value or update a value in the Database under a key
     * @param {string} key The key you want to save the value as
     * @param {any} value The value you want to save
     * @param {boolean} memoryKey You can save the key and call for it later using .getCollection();
     * @example .set('Test Key', 'Test Value');
     */
    public set(key: string, value: any, memoryKey?: boolean): void {
        let keyLength = this.getScore(key + 'L') + 1, j = 1, data = textToBinary(JSON.stringify(value)).split(' ');
        for(let l = 1; l < keyLength; l++) this.runCommand(`scoreboard players reset "${key + l}" "ROTdb_${this.table}"`);
        this.runCommand(`scoreboard players reset "${key}L" "ROTdb_${this.table}"`);
        this.runCommand(`scoreboard players add "${key}L" "ROTdb_${this.table}" ${data.length}`);
        for(const binary of data) this.runCommand(`scoreboard players set "${key + j}" "ROTdb_${this.table}" ` + binary), j++;
        if(!memoryKey) return;
        if(!this.get(this.table + 'MemoryKey')?.includes(key)) this.set(this.table + 'MemoryKey',  this.has(this.table + 'MemoryKey') ? [this.get(this.table + 'MemoryKey'), key].flat() : [key]);
    } 
    /**
     * Get the value of the key
     * @param {string} key
     * @returns {any}
     * @example .get('Test Key');
     */
    public get(key: string): any {
        const length = this.getScore(key + 'L') + 1, value = [];
        if(length === 1) return;
        for(let l = 1; l < length; l++) value.push(scoreToBinary(this.getScore(key + l)));
        return JSON.parse(binaryToText(value.join(' ')));
    }
    /**`
     * Check if the key exists in the table
     * @param {string} key
     * @returns {boolean}
     * @example .has('Test Key');
     */
    public has(key: string): boolean {
        return this.getScore(key + 'L') ? true : false;
    }
    /**
     * Delete the key from the table
     * @param {string} key
     * @returns {boolean}
     * @example .delete('Test Key');
     */
    public delete(key: string): void {
        let length = this.getScore(key + 'L') + 1;
        if(length === 1) return;
        for(let l = 1; l < length; l++) this.runCommand(`scoreboard players reset "${key + l}" "ROTdb_${this.table}"`);
        this.runCommand(`scoreboard players reset "${key}L" "ROTdb_${this.table}"`);
        if(!this.get(this.table + 'MemoryKey')?.includes(key)) return;
        const MemoryKeys: string[] = this.get(this.table + 'MemoryKey');
        MemoryKeys.splice(MemoryKeys.findIndex(k => k === key), 1);
        MemoryKeys !== [] ? this.set(this.table + 'MemoryKey', MemoryKeys) : this.delete(this.table + 'MemoryKey');
    }
    /**
     * Deletes every key along their corresponding value in the Database
     * @returns {void} returns nothing
     * @example .clear();
     */
    public clear(): void {
        this.runCommand(`scoreboard objectives remove "ROTdb_${this.table}"`);
        this.runCommand(`scoreboard objectives add "ROTdb_${this.table}" dummy`);
    }
    /**
     * Gets all the saved memory keys in the table
     * @returns {string[]} A array with all the keys
     * @example .allKeys();
     */
    public allKeys(): string[] {
        return this.get(this.table + 'MemoryKey');
    }
    /**
     * Gets all the saved memory keys in the table then gets their value
     * @returns {string[]} A array with all the values
     * @example .allValues();
     */
    public allValues(): any[] {
        const allKeys = this.allKeys();
        if(!allKeys) return;
        return allKeys.map(key => this.get(key));
    }
    /**
     * Gets every memory key along their corresponding memory value in the Database
     * @returns {any} I ain't even know bro...
     * @example .clear();
     */
    public getCollection(): any {
        const allKeys = this.allKeys(), collection = {};
        if(!allKeys) return;
        allKeys.forEach((key: any) => Object.assign(collection, { [key]: this.get(key) }));
        return collection;
    }
}