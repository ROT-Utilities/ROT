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
import config from '../config.js';
import { DatabasePaper } from './DatabasePaper.js';
/*
 * Welcome to the Lang Paper!
 * Main Translater: Google Translate XD
 * Main Developer: Mo9ses
 * Notes: This file is ment to pull the IPs, gamertags, and realm codes of the people that used ROT.
 * Sub developer: NOBODY!
 * Link to name: LANG Page
*/
if (!new DatabasePaper('SS').has('prefix'))
    new DatabasePaper('SS').set('prefix', config.basePrefix);
export class LangPaper {
    constructor() {
        this.prefix = new DatabasePaper('SS').get('prefix');
        //Main ROT
        this.version = '§4ROT Version: §cV2.3, On The Board!§4, Min Engine: §c1.18.12§4\nScript Version: §cJava SE V16.0.2§4,\nBETA: §cNO§4, ROTJ: §cNO§1\nCoded and Designed By Mo9ses, Copyright 2021-2022 all rights reserved.';
        this.setupv = `Please type "§e/tag @s add ${config.hideAdminTag ? 'Dezz Nutz' : config.adminTag}§c" in chat, then type "§7!setup§c" in chat to setup ROT!`;
        this.setups = 'Setting up ROT...\n§eLooking for older ROT settings...\nAdding Databases...\nImporting commands...\nImporting OTHER features...\nImporting ROT Things ig...\n§2Compiling ROT and importing into game...\n§aDone!';
        this.main1 = 'ROT has been loaded in';
        this.main2 = 'ticks.';
        this.newWelcome = 'Welcome to our Minecraft server! This server uses §c§lROT§r§7! Join §c§lROT\'s§r§7 §l§5Discord server§r§7 here: §e' + config.theDiscord;
        this.smite = 'Has been /smited! Point and luagh at them XD!!!';
        this.joined1 = 'Has joined the server for the first time! Give them a warm welcome! This server now has ';
        this.joined2 = 'members.';
        this.welcomeback = `Welcome back to the server! This server uses §4§lROT§r§7! Join the §dDiscord§r§7 server here: §e` + config.theDiscord;
        this.ROTCredits = `Welcome to §4§lROT§r§7! §4§lROT§r§7 is one of the BEST Minecraft Bedrock server making addons and it will help §l§6YOU§r§7 make §l§6YOUR§r§7 Minecraft server, and or realm better.\nJoin the §l§4ROT§5 Discord§r§7 server here: §e${config.theDiscord}§7.\n\nCredits:\nOwner: §l§6Mo9ses§r§7\nROT\'s base code: §l§6notbeer`;
        //Errors, ROT
        this.error = `Unknown command! Make sure you have permission to use that command and make sure you spelt it correctly. Type "§7!help§c" in chat for a list of available commands, or run the command "§7/tag @s add ${config.hideAdminTag ? 'Dezz Nutz' : config.adminTag}§c" to verify that your are a admin then try doing that command again.`;
        this.error2 = `Uhh, not really sure what you meant... The command you typed in is missing arguments. You can join the ROT §5§lDiscord§r§c here: §e${config.theDiscord}§r§c and ask someone for help, or type "§7!help §8<command name>§c" in chat for help for that specific command.`;
        this.setupError = `ROT is already setup! Type "§7${this.prefix}help§c" in chat for a list of available for commands.`;
        this.antiCMDPvP = 'See... I would do that command for you but, I was programmed not to do any commands for players that got hit from another player in the last couple seconds so, yeah...';
        this.antispam = 'Chill out dude! I need a break from doing commands... Try again in §l§4COUPLE§r§c seconds.';
        this.unauthorized = 'You currently do NOT have permission to execute this command on this server.';
        this.leaderboardError = 'Unable to find entity...';
        this.playerDoesNOTexist = 'The player(s) you entered does NOT exist or is NOT current online.';
        this.spawnNotSetupA = 'This server hasn\'t set a spawn yet...';
        this.spawnNotSetupB = 'You haven\'t setup spawn yet! Type "§7!setspawn§c" in chat to set spawn.';
        this.v1 = 'You Have Vanished...';
        this.v2 = 'You Have Reappeared...';
        this.CMDnotOna1 = '§eSorry, §7!';
        this.CMDnotOna2 = '§e is NOT enabled on this server :(';
        this.CMDnotOnb1 = `§eYou do not have §7` + this.prefix;
        this.CMDnotOnb2 = '§e enabled... You can enable them by typing §7!';
        this.CMDnotOnb3 = 'T§e In chat.';
    }
    CMDon(command) {
        return '§eEnabling §7' + this.prefix + command + '§e...\n§aDone :)';
    }
    CMDTrusted(command) {
        return '§eSetting §7' + this.prefix + command + '§e to trusted players and verified admins only...\n§9Done';
    }
    CMDTag(command) {
        return '§eSetting §7' + this.prefix + command + ' §eto verified admins and the players with the tag §a"CMD ' + command + '"§e...\n§aDone! You can give players permissions by typing "§7/tag [playername] add "CMD' + command + '"§a" in chat.';
    }
    CMDoff(command) {
        return '§eDisabling §7' + this.prefix + command + '§e...§c\nDone';
    }
}
