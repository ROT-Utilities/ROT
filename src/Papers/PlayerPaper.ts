/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
Aex66 (Developer),
notbeer (ROT's base code)
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
import { world, Player } from 'mojang-minecraft';
import { ServerPaper } from './ServerPaper.js';
import config from '../config.js';
/*
 * Welcome to the Player Builder!
 * Main Developer: notbeer
 * Notes: So much has been added to thia XD
 * Sub developer: Mo9ses
 * Link to name: Player Paper
*/
export class PlayerPaper {
    /**
     * Look if player is in the game
     * @param {string} player Player you are looking for
     * @returns {boolean}
     * @example .find('notbeer');
     */
    find(player: string): boolean {
        return this.list().some(member => member.toLowerCase() === player.replace(/"/g, '').toLowerCase())
    }
    /**
     * Look for a tag on player(s)
     * @param {string} tag Tag you are seraching for(WARNING: Color Coding with § is ignored)
     * @param {string} [player] Requirements for the entity
     * @returns {boolean}
     * @example .findTag("Owner", 'notbeer');
     */
    findTag(tag: string, player: string): boolean {
        return this.fetch(player)?.hasTag(tag);
    }
    /**
     * Fetch an online players data
     * @param {string} player The player you are looking for
     * @returns {Player}
     * @example .fetch('mo9ses');
     */
    fetch(player: string): Player {
        for(const p of world.getPlayers()) if(player && p.nameTag.toLowerCase() === player.toLowerCase()) return p;
    }
    /**
     * Gets the dimension of a player
     * @param {string} player The player you are looking for
     * @returns {Dimension}
     * @example .getDimension('mo9ses');
     */
    getDimension(player: string): string {
        const fullPlayer = this.fetch(player).dimension;
        for(const dimension of ["overworld", "nether", "the end"]) if(fullPlayer === world.getDimension(dimension)) return dimension;
    }
    /**
     * Get tags player(s) has
     * @param {string} [player] Requirements for the entity
     * @returns {Array<string>}
     * @example .getTags('notbeer');
     */
    getTags(player: string): Array<string> {
        return this.fetch(player)?.getTags();
    }
    /**
     * Get list of players in game
     * @returns {Array<string>}
     * @example .list();
     */
    list(): Array<string> {
        return new ServerPaper().runCommand(`list`).players.split(', ');
    }
    /**
     * Get players score on a specific objective
     * @param {string} objective Objective name you want to search
     * @param {string} player Requirements for the entity
     * @param {number} [minimum] Minumum score you are looking for
     * @param {number} [maximum] Maximum score you are looking for
     * @returns {number}
     * @example .getScore('Money', 'notbeer', { minimum: 0 });
     */
    getScore(objective: string, player: string, {minimum, maximum }: {minimum?: number, maximum?: number } = {}): number {
        const data = new ServerPaper().runCommand(`scoreboard players test ${player.startsWith('"') ? player : `"${player}"`} ${objective} ${minimum ? minimum : '*'} ${maximum ? maximum : '*'}`);
        if(data.error) return;
        return parseInt(data.statusMessage.match(/-?\d+/)[0]);
    }
    /**
     * Checks if the player has the admin tag
     * @param {string} player The player you are testing
     * @returns {boolean}
     * @example .isAdmin('notbeer');
     */
    isAdmin(player: string): boolean {
        return this.findTag(config.adminTag, player);
    }
    /**
     * Checks if the player has the T tag
     * @param {string} player The player you are testing
     * @returns {boolean}
     * @example .isTrusted('notbeer');
     */
    isTrusted(player: string): boolean {
        return this.findTag('t', player);
    }
}