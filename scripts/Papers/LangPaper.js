import quick from './DatabasePaper';
/*
 * Welcome to the Lang Paper!
 * Main Translater: Google Translate XD
 * Main Developer: Mo9ses
 * Notes: This file is ment to pull the IPs, gamertags, and realm codes of the people that use ROT.
 * Sub developer: NOBODY!
*/
export const lang = {
    cmd: {
        unknown: `Unknown command! Make sure you have permission to use that command and make sure you spelt it correctly. Type "§7${quick.prefix}help§c" in chat for a list of available commands${quick.hideAdminTag ? '.' : `, or run the command "§7/tag @s add ${quick.adminTag}§c" to verify that your are a admin then try doing the command again.`}`,
        wrongPrefix: `Sorry, the prefix on this server is now "§7${quick.prefix}§c"`,
        noArgs: 'This commands does not have any arguments! You only need to type the command.',
        notAArg: (cmd, before, err, afther, tip) => `Not sure what you mean by "§7${quick.prefix + cmd}${before.length ? ` ${before.join(' ')}` : ''}§r §4§l${err}§r§7${afther ? ` §e${afther}` : ''}§r§c". §4§l${err[0].toUpperCase() + err.slice(1)}§r§c is not a vaild argument.${tip ? ` Maybe try typing §a${tip}§c?` : ''}`,
        noPerms: 'You do not have permission to execute this command.',
        noArgPerm: 'You do not have permission to execute this argument. How do you even know about it?',
        missingArgs: (cmd, args, tip) => `The command you typed: "§7${quick.prefix + cmd}${args.length ? ' ' + args.join(' ') : ''}§c" is missing arguments!${tip ? ` Maybe try typing §a${tip}§c at the end.` : ''} If you need more help, type "§6${quick.prefix}help ${cmd}§c" in chat :)`,
        maxArgs: (error) => `You typed too many arguments! Try removing "§4${error}§r§c".`,
        needVal: (val) => `You need to type a name! If you need more help, type "§6${quick.prefix}help ${val}§c" in chat.`,
        valErr: (val) => `The value you typed in is incorrect. If you need more help, type "§6${quick.prefix}help ${val}§c" in chat.`,
        openQou: `It seems like you have open quotes somewhere. Make sure to close them!`,
        missingPlr: (val) => `You need to type a player's name. Did you mean to type "§e${val}§c"?`,
    },
    chat: {
        mutted: 'Sorry, you have been muted by ROT or an admin',
    }
};
