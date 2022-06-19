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
import Server from '../../ServerBook.js';
import config from '../../config.js';
if(!Server.settings.getScore('wildMax')) Server.settings.setScore('wildMax', 10000);
if(!Server.settings.getScore('wildMin')) Server.settings.setScore('wildMin', 300);
if(!Server.settings.getScore('wildOriginX')) Server.settings.setScore('wildOriginX', 0);
if(!Server.settings.getScore('wildOriginZ')) Server.settings.setScore('wildOriginZ', 0);
Server.command.register({
    cancelMessage: true,
    name: 'wild',
    description: `When you type ${Server.lang.prefix}wild in chat... I'll teleport you between ${Server.settings.getScore('wildMin')} and ${Server.settings.getScore('wildMax')} blocks from ${Server.settings.getScore('wildOriginX')}, ${Server.settings.getScore('wildOriginZ')}!`,
    aliases: ['wilderness'],
    category: 'Escape',
    documentation: {
        usage: 'wild <player?>',
        examples: [
            'wild',
            'wild notbeer',
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if(!Server.basicToggleChecker('wild', chatmsg.sender.name)) return;
    if(args[0]) {
        if(!Server.player.isAdmin(chatmsg.sender.name)) return Server.eBroadcast(Server.lang.unauthorized, chatmsg.sender.name, 'WILD');
        if(args[0].startsWith('@')) var player = args.join(' '); else {
            if(!Server.player.find(args.join(' '))) return Server.eBroadcast(Server.lang.playerDoesNOTexist, chatmsg.sender.name, 'WILD');
            player = `"${args.join(' ')}"`;
        }
    } else player = `"${chatmsg.sender.name}"`;
    let nx = Math.floor(Math.random() * 10) + 1, nz = Math.floor(Math.random() * 10) + 1, x = 0; (x = Server.settings.getScore('wildMax') * Math.random() + Server.settings.getScore('wildMin')); x = ~~x; let z = 0; (z = Server.settings.getScore('wildMax') * Math.random() + Server.settings.getScore('wildMin')); z = ~~z, nx = ~~nx, nz = ~~nz;
    if(nx <= 4) x = -Math.abs(x); if(nz <= 4) z = -Math.abs(z);
    Server.broadcast(`Finding a location between ${Server.settings.getScore('wildMin')} and ${Server.settings.getScore('wildMax')}... \n§cLocation found!`, player, 'WILD');
    Server.runCommands([
        `execute ${player} ~~~ tp @s ${Server.settings.getScore('wildOriginX')} 330 ${Server.settings.getScore('wildOriginZ')}`,
        `execute ${player} ~~~ tp @s ~${x} 330 ~${z}`, `effect ${player} resistance 255 15 true`,
        `scoreboard players set @a[name="${player}",tag=!"${config.adminTag}"] ROTCommandTimeout ` + config.wildCoolDown
    ]);
});
const registerInformationWILDT = {
    cancelMessage: true,
    name: 'wildt',
    description: `Toggles ${Server.lang.prefix}wild so people can use ${Server.lang.prefix}wild how you set it to.`,
    aliases: ['wt', 'wildtoggle', 'wildernesstoggle'],
    category: 'Escape',
    admin: true,
    documentation: {
        usage: 'wildt',
        examples: [
            'wildt'
        ],
        developers: ['Mo9ses']
    }
};
Server.command.register(registerInformationWILDT, chatmsg => Server.basicCommandToggle('wild', chatmsg.sender.name));
const registerInformationWILDADJUST = {
    cancelMessage: true,
    name: 'wilda',
    description: `Use this command to adjust ${Server.lang.prefix}wild to your liking!`,
    aliases: ['wildadjust', 'wildset', 'wildsetting', 'wildsettings'],
    category: 'Escape',
    admin: true,
    documentation: {
        usage: 'wild <origin|max|min> <number> <number?>',
        examples: [
            'wild origin',
            'wild max 30000',
            'wild min 200',
        ],
        developers: ['Mo9ses']
    }
};
Server.command.register(registerInformationWILDADJUST, (chatmsg, args) => {
    const max = ['max', 'top', 'most', 'furthest'], min = ['min', 'short', 'shortest'], origin = ['origin', 'middle', 'point', 'spawn', 'hub', 'center'];
    let number = parseInt(args[1]);
    if(max.includes(args[0])) {
        if(isNaN(number)) return Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'WILD SETTINGS');
        if(number < 0) return Server.eBroadcast('That number is too small!§8 That\'s what she said XD...', chatmsg.sender.name, 'WILD SETTINGS');
        if(-5000001 > number || number > 5000001) return Server.eBroadcast('Yeah, no... No numbers greater than 5 million.', chatmsg.sender.name, 'WILD SETTINGS');
        if(number <= Server.settings.getScore('wildMin')) return Server.eBroadcast(`The maximum of ${Server.lang.prefix}wild CANNOT be less than minimum!`, chatmsg.sender.name, 'WILD SETTINGS');
        Server.settings.setScore('wildMax', number);
    } else if(min.includes(args[0])) {
        if(isNaN(number)) return Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'WILD SETTINGS');
        if(number < 0) return Server.eBroadcast('That number is too small!§8 That\'s what she said XD...', chatmsg.sender.name, 'WILD SETTINGS');
        if(-5000001 > number || number > 5000001) return Server.eBroadcast('Yeah, no... No numbers greater than 5 million.', chatmsg.sender.name, 'WILD SETTINGS');
        if(number >= Server.settings.getScore('wildMax')) return Server.eBroadcast(`The minimum of ${Server.lang.prefix}wild CANNOT be greater than maximum!`, chatmsg.sender.name, 'WILD SETTINGS');
        Server.settings.setScore('wildMin', number);
    } else if(origin.includes(args[0])) {
        Server.settings.setScore('wildOriginX', Math.trunc(chatmsg.sender.location.x));
        Server.settings.setScore('wildOriginZ', Math.trunc(chatmsg.sender.location.z));
    } else return Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'WILD SETTINGS');
    Server.broadcast(`The ${Server.lang.prefix}wild range is now between §c${Server.settings.getScore('wildMin')}§7 and §c${Server.settings.getScore('wildMax')}§7 at the center point §c${Server.settings.getScore('wildOriginX')}§7, §c${Server.settings.getScore('wildOriginZ')}§7!`, chatmsg.sender.name, 'WILD SETTINGS');
});