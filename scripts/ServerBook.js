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
import { CommandPaper } from './Papers/CommandPaper.js';
import { ServerPaper } from './Papers/ServerPaper.js';
import { PlayerPaper } from './Papers/PlayerPaper.js';
import { DatabasePaper } from './Papers/DatabasePaper.js';
import { LangPaper } from './Papers/LangPaper.js';
import { MS } from './Papers/paragraphs/ConvertersParagraphs.js';
import { getChat, getColors, getRanks } from './Papers/paragraphs/ExtrasParagraphs.js';
import { world } from 'mojang-minecraft';
import config from './config.js';
/*
 * Welcome to the SERVER Book!
 * Main Developer: notbeer
 * Notes: Now all the code above is combined into this section here
 * Sub developer: Mo9ses
 * Link to name: Server Code
*/
class NewServerBook extends ServerPaper {
    constructor() {
        super();
        //Server classes
        this.command = new CommandPaper();
        this.player = new PlayerPaper();
        this.lang = new LangPaper();
        //Databases
        this.settings = new DatabasePaper('SS');
        this.bans = new DatabasePaper('BS');
        this.mutes = new DatabasePaper('MS');
        this.sc = new DatabasePaper('SC');
        this.tpa = new DatabasePaper('TPA');
        this._buildEvent();
    }
    /**
     * @private
     */
    _buildEvent() {
        world.events.beforeChat.subscribe(data => {
            const time = new Date();
            data.cancel = true;
            //This won't allow people to use versions of ROT that are too old. This version will stop working on March 2022.
            if (time.getMonth() === 6 && time.getFullYear() >= 2022) {
                data.cancel = false;
                return this.eBroadcast('The current version of ROT you are using to too old! You can find a new version on ROT\'s Discord server here: §e' + config.theDiscord, data.sender.name, 'ROT');
            }
            /**
             * This is the Anti Spam system and Mute system
             */
            if (this.player.getScore('ROTMessageMute', data.sender.name) >= 4 && !this.player.findTag('ROTmute', data.sender.name)) {
                const muteData = {
                    mutedplayer: data.sender.name,
                    date: `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`,
                    length: config.spamMuteTime * 60000,
                    unmuteTime: time.getTime() + (config.spamMuteTime * 60000),
                    reason: 'spaming chat',
                    mutedBy: '§4§lROT§r',
                    playerUUID: this.player.getScore('ROTplayerUUID', data.sender.name)
                };
                this.mutes.set(data.sender.name, muteData);
                this.broadcast(`Successfully muted §c${data.sender.name}§r§7 for §c${config.spamMuteTime} minutes§7 for "§cSpaming chat§7"!`, '@a', 'ROT');
                this.runCommand('scoreboard players reset @a ROTMessageMute');
            }
            if (this.mutes.has(data.sender.name)) {
                const mute = this.mutes.get(data.sender.name);
                if (mute?.unmuteTime < time.getTime()) {
                    this.runCommand(`tag "${data.sender.name}" remove ROTmute`);
                    this.mutes.delete(data.sender.name);
                    this.broadcast('You have been unmuted. Don\'t get muted again!', data.sender.name, 'ROT');
                }
                else {
                    this.runCommand(`tag "${data.sender.name}" add ROTmute`);
                    return this.eBroadcast(`Sorry, you have been muted by ROT or an admin${mute?.reason ? ` for§4 ${mute?.reason}§r§c!` : '.'} Try again in: §4${MS(mute?.unmuteTime - time.getTime())}§c...`, data.sender.name, 'CHAT MESSAGE');
                }
            }
            /**
             * This is for the command builder and chatranks
             */
            if (!data.message.startsWith(this.lang.prefix)) {
                if (!this.settings.getScore('ROT'))
                    return data.cancel = false;
                if (data.message.startsWith('!'))
                    return this.eBroadcast(`Sorry, the prefix on this server is now "§7${this.lang.prefix}§c"`, data.sender.name, 'ROT');
                if (this.player.findTag('mute', data.sender.name))
                    return this.eBroadcast('Sorry, you have been muted by ROT or an admin', data.sender.name, 'CHAT MESSAGE');
                if (data.message.trim() === '')
                    return;
                if (config.antiSpam && !this.player.isTrusted(data.sender.name))
                    this.runCommand(`scoreboard players add "${data.sender.name}" ROTMessageMute 1`);
                const message = data.message.charAt(0).toUpperCase() + data.message.slice(1), RankName = `§7[${config.coolerChatRanks ? getRanks(data.sender.name) : getRanks(data.sender.name).split('§r§7, ').join('§r§7] [')}] ${getColors(data.sender.name) + data.sender.name}§r§7`, chat = getChat(data.sender.name);
                for (const player of this.player.list().filter(member => this.player.getScore('ROTPrivateChat', data.sender.name) === Server.player.getScore('ROTPrivateChat', member))) {
                    let currentHour = time.getUTCHours() + (this.player.getScore('ROTTimezone', player) ?? 0), AMPM = '';
                    if (currentHour < 0)
                        currentHour = currentHour + 24;
                    if (currentHour <= 12)
                        AMPM = currentHour === 12 ? ' PM' : ' AM', currentHour === 0 ? currentHour = 12 : null;
                    else
                        currentHour = currentHour - 12, AMPM = ' PM';
                    this.broadcast((this.player.getScore('ROTPrivateChat', data.sender.name) > 0 ? '§a§lPRIVATE§r §e- ' : '')
                        + RankName
                        + (config.displayChatTime ? ' ' + currentHour + ':' + `${time.getUTCMinutes() < 10 ? '0' + time.getUTCMinutes() : time.getUTCMinutes()}` + AMPM : '')
                        + (config.hiveArrow ? ` §l${config.hiveArrowChatColor}§r ` : ': ')
                        + chat + message, player, '', false);
                }
                return;
            }
            const args = data.message.slice(this.lang.prefix.length).trim().split(/\s+/), command = args.shift().toLowerCase(), getCommand = this.command.getAllRegistation().some(element => element.name === command || element.aliases && element.aliases.includes(command));
            if (!this.player.find(data.sender.name))
                return;
            if (!getCommand) {
                data.cancel = true;
                return this.eBroadcast(this.lang.error, data.sender.name, 'ROT');
            }
            this.command.getAllRegistation().forEach(element => {
                if (element.name !== command && !element?.aliases?.includes(command))
                    return;
                /**
                 * Registration callback
                 */
                if (element?.cancelMessage)
                    data.cancel = true;
                if (this.settings.getScore('ROT') !== 1 && command !== 'setup')
                    return this.eBroadcast(this.lang.setupv, data.sender.name, 'ROT');
                if (element?.admin && !this.player.isAdmin(data.sender.name))
                    return this.eBroadcast(this.lang.error, data.sender.name, 'ROT');
                const postCMDTime = Date.now();
                try {
                    element.callback(data, args);
                }
                catch (error) {
                    this.eBroadcast(error + ':' + error.stack, data.sender.name, 'ROT');
                }
                finally {
                    if (config.tellTime)
                        this.broadcast(`Command executed in §c${Date.now() - postCMDTime}§7 MS!`, data.sender.name, 'ROT');
                }
            });
        });
    }
    /**
    * Command toggler
    * @param command The command you want to be able to toggle on and off
    * @param player The player you are executing the message to
    * @returns The command status to the Server.settings database
     */
    basicCommandToggle(command, player) {
        if (!this.settings.getScore(command))
            this.settings.setScore(command, 0);
        if (this.settings.getScore(command) === 0)
            return this.broadcast(this.lang.CMDon(command), player), this.settings.setScore(command, 1);
        if (this.settings.getScore(command) === 1)
            return this.broadcast(this.lang.CMDTrusted(command), player), this.settings.setScore(command, 2);
        if (this.settings.getScore(command) === 2)
            return this.broadcast(this.lang.CMDTag(command), player), this.settings.setScore(command, 3);
        if (this.settings.getScore(command) === 3)
            this.broadcast(this.lang.CMDoff(command), player), this.settings.setScore(command, 0);
    }
    /**
     * @param command The command you are check the permission value of
     * @param player The player target
     * @returns {boolean}
     */
    basicToggleChecker(command, player) {
        if (!this.settings.getScore(command))
            this.settings.setScore(command, 0);
        if (this.settings.getScore(command) === 0) {
            this.eBroadcast(this.player.isAdmin(player) ? this.lang.CMDnotOnb1 + command + this.lang.CMDnotOnb2 + command + this.lang.CMDnotOnb3 : this.lang.CMDnotOna1 + command + this.lang.CMDnotOna2, player, 'ROT');
            return false;
        }
        if (this.settings.getScore(command) === 2 && !Server.player.isTrusted(player)) {
            this.eBroadcast(this.lang.unauthorized, player, 'ROT');
            return false;
        }
        if (this.settings.getScore(command) === 3 && !this.player.findTag('CMD' + command, player) && !this.player.isAdmin(player)) {
            this.eBroadcast(this.lang.unauthorized, player, 'ROT');
            return false;
        }
        if (this.player.getScore('ROTCommandTimeout', player) > 0) {
            this.eBroadcast(this.lang.antispam, player, 'ROT');
            return false;
        }
        if (this.player.findTag('last_hit_by_player', player) && config.antiCommandPvP === true) {
            this.eBroadcast(this.lang.antiCMDPvP, player, 'ROT');
            return false;
        }
        this.runCommand(`scoreboard players set @a[name="${player}",tag=!"${config.adminTag}"] ROTCommandTimeout ` + config.commandCooldown);
        return true;
    }
}
/**
 * Import this
 */
const Server = new NewServerBook();
export default Server;
