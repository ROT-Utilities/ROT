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
import quick from '../main.js';
/*
 * Welcome to the Lang Paper!
 * Main Translater: Google Translate XD
 * Main Developer: Mo9ses
 * Notes: This file is ment to pull the IPs, gamertags, and realm codes of the people that use ROT.
 * Sub developer: NOBODY!
*/
const Lang = {};
export const startLang = () => Object.assign(Lang, {
    setup: {
        version: '§bROT Version: §1V3 part 2, Light!§b, Min Engine: §11.19.40§b\nAPI: §bQROT Light§b,\nBETA: §1YES§b, ROTJ: §1NO§1\nCoded and Designed By Mo9ses, Copyright 2021-2022 all rights reserved.',
        notSetup: `Please type "§e/tag @s add ${quick.adminTag}§1" in chat to verify that you are a admin, then type "§3!setup§1" in chat to setup ROT!`,
        setup: 'Setting up ROT...\n§3Looking for older ROT settings...\nAdding Databases...\nImporting commands...\nImporting OTHER features...\nImporting ROT Things ig...\n§aDone!',
        loaded: (ms) => `ROT has been loaded in ${ms} milliseconds!`,
    },
    cmd: {
        unknown: `Unknown command! Make sure you have permission to use that command and make sure you spelt it correctly. Type "§3${quick.prefix}help§1" in chat for a list of available commands${quick.hideAdminTag ? '.' : `, or run the command "§3/tag @s add ${quick.adminTag}§1" to verify that your are a admin then try doing the command again.`}`,
        useForm: 'This command cannot be execute in chat. Use "§3!ui§1" to run it as a form command.',
        wrongPrefix: `Sorry, the prefix on this server is now "§3${quick.prefix}§1"`,
        noArgs: 'This commands does not have any arguments! You only need to type the command.',
        notAArg: (cmd, before, err, afther, tip) => `Not sure what you mean by "§3${quick.prefix + cmd}${before.length ? ` ${before.join(' ')}` : ''}§r §b${err}§r§3${afther ? ` §3${afther}` : ''}§r§1". §b${err[0].toUpperCase() + err.slice(1)}§r§1 is not a vaild argument.${tip ? ` Maybe try typing §a${tip}§1?` : ''}`,
        noPerms: 'You do not have permission to execute this command.',
        noArgPerm: 'You do not have permission to execute this argument. How do you even know about it?',
        missingArgs: (cmd, args, tip) => `The command you typed: "§3${quick.prefix + cmd}${args.length ? ' ' + args.join(' ') : ''}§1" is missing arguments!${tip ? ` Maybe try typing §a${tip}§1 at the end.` : ''} If you need more help, type "§3${quick.prefix}help ${cmd}§1" in chat :)`,
        maxArgs: (error) => `You typed too many arguments! Try removing "§b${error}§r§1".`,
        needVal: (val) => `You need to type a name! If you need more help, type "§3${quick.prefix}help ${val}§1" in chat.`,
        valErr: (val) => `The value you typed in is incorrect. If you need more help, type "§3${quick.prefix}help ${val}§1" in chat.`,
        openQou: `It seems like you have open quotes somewhere. Make sure to close them!`,
        missingPlr: (val) => `You need to type a player's name. Did you mean to type "§e${val}§1"?`,
    },
    chat: {
        mutted: 'Sorry, you have been muted by ROT or an admin',
    }
});
export default Lang;
