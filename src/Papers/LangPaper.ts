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
import { DatabasePaper } from './DatabasePaper.js'
/*
 * Welcome to the Lang Paper!
 * Main Translater: Google Translate XD
 * Main Developer: Mo9ses
 * Notes: This file is ment to pull the IPs, gamertags, and realm codes of the people that used ROT.
 * Sub developer: NOBODY!
 * Link to name: LANG Page
*/
if(!new DatabasePaper('SS').has('prefix')) new DatabasePaper('SS').set('prefix', config.basePrefix);
export class LangPaper {
    public prefix = new DatabasePaper('SS').get('prefix');
    //Main ROT
    public version: string = '§4ROT Version: §cV2.3, On The Board!§4, Min Engine: §c1.18.12§4\nScript Version: §cJava SE V16.0.2§4,\nBETA: §cNO§4, ROTJ: §cNO§1\nCoded and Designed By Mo9ses, Copyright 2021-2022 all rights reserved.';
    public setupv: string = `Please type "§e/tag @s add ${config.hideAdminTag ? 'Dezz Nutz' : config.adminTag}§c" in chat, then type "§7!setup§c" in chat to setup ROT!`;
    public setups: string = 'Setting up ROT...\n§eLooking for older ROT settings...\nAdding Databases...\nImporting commands...\nImporting OTHER features...\nImporting ROT Things ig...\n§2Compiling ROT and importing into game...\n§aDone!';
    public main1: string = 'ROT has been loaded in';
    public main2: string = 'ticks.';
    public newWelcome: string = 'Welcome to our Minecraft server! This server uses §c§lROT§r§7! Join §c§lROT\'s§r§7 §l§5Discord server§r§7 here: §e' + config.theDiscord;
    public smite: string = 'Has been /smited! Point and luagh at them XD!!!';
    public joined1: string = 'Has joined the server for the first time! Give them a warm welcome! This server now has ';
    public joined2: string = 'members.';
    public welcomeback: string = `Welcome back to the server! This server uses §4§lROT§r§7! Join the §dDiscord§r§7 server here: §e` + config.theDiscord;
    public ROTCredits: string = `Welcome to §4§lROT§r§7! §4§lROT§r§7 is one of the BEST Minecraft Bedrock server making addons and it will help §l§6YOU§r§7 make §l§6YOUR§r§7 Minecraft server, and or realm better.\nJoin the §l§4ROT§5 Discord§r§7 server here: §e${config.theDiscord}§7.\n\nCredits:\nOwner: §l§6Mo9ses§r§7\nROT\'s base code: §l§6notbeer`;
    //Errors, ROT
    public error: string = `Unknown command! Make sure you have permission to use that command and make sure you spelt it correctly. Type "§7!help§c" in chat for a list of available commands, or run the command "§7/tag @s add ${config.hideAdminTag ? 'Dezz Nutz' : config.adminTag}§c" to verify that your are a admin then try doing that command again.`;
    public error2: string = `Uhh, not really sure what you meant... The command you typed in is missing arguments. You can join the ROT §5§lDiscord§r§c here: §e${config.theDiscord}§r§c and ask someone for help, or type "§7!help §8<command name>§c" in chat for help for that specific command.`;
    public setupError: string = `ROT is already setup! Type "§7${this.prefix}help§c" in chat for a list of available for commands.`;
    public antiCMDPvP: string = 'See... I would do that command for you but, I was programmed not to do any commands for players that got hit from another player in the last couple seconds so, yeah...';
    public antispam: string = 'Chill out dude! I need a break from doing commands... Try again in §l§4COUPLE§r§c seconds.';
    public unauthorized: string = 'You currently do NOT have permission to execute this command on this server.';
    public leaderboardError: string = 'Unable to find entity...';
    public playerDoesNOTexist: string = 'The player(s) you entered does NOT exist or is NOT current online.';
    public spawnNotSetupA: string = 'This server hasn\'t set a spawn yet...'
    public spawnNotSetupB: string = 'You haven\'t setup spawn yet! Type "§7!setspawn§c" in chat to set spawn.';
    public v1: string = 'You Have Vanished...';
    public v2: string = 'You Have Reappeared...';
    CMDon(command: string): string {
        return '§eEnabling §7' + this.prefix + command + '§e...\n§aDone :)'
    }
    CMDTrusted(command: string): string {
        return '§eSetting §7' + this.prefix + command + '§e to trusted players and verified admins only...\n§9Done'
    }
    CMDTag(command: string): string {
        return '§eSetting §7' + this.prefix + command + ' §eto verified admins and the players with the tag §a"CMD ' + command + '"§e...\n§aDone! You can give players permissions by typing "§7/tag [playername] add "CMD' + command + '"§a" in chat.'
    }
    CMDoff(command: string): string {
        return '§eDisabling §7' + this.prefix + command + '§e...§c\nDone'
    }
    public CMDnotOna1: string = '§eSorry, §7!'
    public CMDnotOna2: string = '§e is NOT enabled on this server :('
    public CMDnotOnb1: string = `§eYou do not have §7` + this.prefix
    public CMDnotOnb2: string = '§e enabled... You can enable them by typing §7!'
    public CMDnotOnb3: string = 'T§e In chat.'
}