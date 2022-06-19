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
import config from '../../config.js';
import Server from '../../ServerBook.js';
Server.command.register({
    cancelMessage: true,
    name: 'help',
    description: 'Get list of all the commands available or input an argument to get information about that specific command',
    aliases: ['?', ''],
    category: 'ROT',
    documentation: {
        usage: 'help <command?>',
        information: 'This command will help find information about a command, or tell you all of the commands',
        examples: [
            'help',
            'help spawn',
            'help warps'
        ],
        developers: ['Mo9ses', 'notbeer']
    }
}, (chatmsg, args) => {
    const cmdInfo = Server.command.getRegistration(args[0]);
    if(cmdInfo) {
        if(cmdInfo.lister) {
            if(cmdInfo.admin && !Server.player.isAdmin(chatmsg.sender.name)) return Server.eBroadcast(Server.lang.error, chatmsg.sender.name, 'HELP');
            let commandsList = [];
            for(let testCommand of Server.command.get()) {
                if((Server.command.getRegistration(testCommand).category ? Server.command.getRegistration(testCommand).category.toLowerCase() : '') === cmdInfo.name.toLowerCase()) commandsList.push('§4§l'+testCommand+'§d - §5'+Server.command.getRegistration(testCommand).description);
            }
            Server.broadcast(`\nHere are all the §c${cmdInfo.name.charAt(0).toUpperCase() + cmdInfo.name.slice(1)}§7 category:\n` + commandsList.join('\n'), chatmsg.sender.name, 'HELP', false);
            return Server.tBroadcast('Join the ROT Discord if you need any more help!§l§d ' + config.theDiscord, chatmsg.sender.name, 'ROT');
        }
        if(cmdInfo && cmdInfo.private) return Server.eBroadcast(Server.lang.error, chatmsg.sender.name, 'HELP');
        if(cmdInfo && cmdInfo.admin && !Server.player.isAdmin(chatmsg.sender.name)) Server.eBroadcast(Server.lang.unauthorized, chatmsg.sender.name);
        let hI = `\n§l§cCommand: §l§5${Server.lang.prefix}§l§4${cmdInfo.name}§r\n`;
        if(cmdInfo.description) hI += `§l§cDescription§5:§r§5 ${cmdInfo.description}\n`;
        if(cmdInfo.aliases) hI += `§l§cAliases§5:\n §c§l${Server.lang.prefix}§r§5${cmdInfo.aliases.join(`§c,\n §l${Server.lang.prefix}§r§5`)}§r\n`;
        if(cmdInfo.category) hI += `§l§cCategory§5: ${cmdInfo.category.toUpperCase()}§c§r\n`;
        if(cmdInfo.documentation) {
            hI += '§l§4Documentation§5:';
            if(cmdInfo.documentation.usage) hI += '\n§l§cUsage§5: ' + cmdInfo.documentation.usage;
            if(cmdInfo.documentation.information) hI += '\n§l§cInformation§5:§r§5 ' + cmdInfo.documentation.information;
            if(cmdInfo.documentation.examples) hI += `\n§l§cExample(s)§5:\n §c§l${Server.lang.prefix}§r§5` + cmdInfo.documentation.examples.join(`§c,\n §l${Server.lang.prefix}§r§5`);
            if(cmdInfo.documentation.notes) hI += '\n§l§cNotes§5: ' + cmdInfo.documentation.notes;
            if(cmdInfo.documentation.developers) hI += `\n§l§cDeveloper(s)§5:\n `+cmdInfo.documentation.developers.join(`§c,\n §5`);
        }
        return Server.broadcast('\n' + hI, chatmsg.sender.name, args[0] + ' HELP'), Server.tBroadcast('Join the ROT Discord if you need any more help!§l§d ' + config.theDiscord, chatmsg.sender.name, 'HELP');
    }
    try {
        Server.tBroadcast('Join the ROT Discord if you need any more help!§l§d ' + config.theDiscord, chatmsg.sender.name, 'HELP');
        let page = isNaN(parseInt(args[0])) ? 1 : parseInt(args[0]), help = '', commandsList = Server.command.get().filter(command => {
            if(Server.command.getRegistration(command).private) return false;
            if(Server.command.getRegistration(command).admin && !Server.player.isAdmin(chatmsg.sender.name)) return false;
            return true;
        });
        // @ts-ignore
        let result = new Array(Math.ceil(commandsList.length / 35)).fill().map(_ => commandsList.splice(0, 35));
        for(let command of result[page - 1]) {
            help += '§4§l';
            let checkCommand = Server.command.getRegistration(command);
            if(checkCommand.lister) help += `\n   §6§l<=-=-=-${checkCommand.name.toUpperCase()}=-=-=->§r\n`; else help += command, help += checkCommand.description ? `§d - §5${checkCommand.description}\n` : '';
        }
        Server.broadcast(help + `\n   §6§l<=-=-=-=-=-=-=-=-=->\n§cPage:§r §a${page}§d/§5${result.length}\nUse "§c${Server.lang.prefix}help§5" §d<Page Number> §5To see the next page`, chatmsg.sender.name, '', false);
    } catch {
        Server.eBroadcast(`Unknown command/page "§4${args[0]}§r§c"!`, chatmsg.sender.name, 'HELP');
    }
});