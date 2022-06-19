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
import { Location, world } from 'mojang-minecraft';
import Server from '../../ServerBook.js';
import { playerID, plotCache } from '../../main.js';
import { setTickInterval } from '../../Papers/paragraphs/ExtrasParagraphs.js';
import { DatabasePaper } from '../../Papers/DatabasePaper.js';
import config from '../../config.js';
const plt = new DatabasePaper('PL');
Server.command.register({
    cancelMessage: true,
    name: 'pl',
    description: 'Use this to control your plot',
    aliases: ['plt', 'is'],
    category: 'building',
    documentation: {
        usage: 'pl <plotName> <tp|reload|delete>',
        notes: 'I remember!',
        examples: [
            'pl skyblock tp',
            'pl island delete',
            'pl skygen reload'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    const tp = ['tp', 'teleport', 'bring', 'pull'], reload = ['reload', 'redo', 're', 'r', 'relog'], del = ['delete', 'del', 'remove', 'quit'];
    if(!plt.has(args[0])) return Server.eBroadcast(`This server doesn\'t has the plot "§4${args[0]}§r§c"!`, chatmsg.sender.name, 'PLT');
    const plot = plt.get(args[0]);
    if(!plot.enabled || !chatmsg.sender.hasTag(plot?.tag)) return Server.eBroadcast('This plot currently isn\'t enabled, or you do not have this plot opened.', chatmsg.sender.name, 'PLT');
    if((tp.includes(args[1]) || !args[1])) {
        const id = playerID[chatmsg.sender.nameTag]; if(!id) return;
        if(!plot?.useSpawnTeleport && !Server.player.isAdmin(chatmsg.sender.name)) return Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'P');
        let row = plot.rowSize >= 2 ? ~~(id / parseInt(plot.rowSize)) : 0, coords = plot.distance.map((pos: number, i: number) => parseInt(plot.startingCoords[i]) + (row >= 1 ? parseInt(plot.nextRow[i]) * row : 0) + (pos * (id - 1)));
        chatmsg.sender.teleport(new Location(coords[0] + plot?.spawnTeleport[0], coords[1] + plot?.spawnTeleport[1], coords[2] + plot?.spawnTeleport[2]), world.getDimension('overworld'), 0, 0);
        return Server.broadcast('Your have been teleported to your plot!', chatmsg.sender.name, 'PLT');
    }
    if(reload.includes(args[1]) && config.letThemReload) {
        const cache: string[] = plotCache[chatmsg.sender.name];
        deletePlot(Server.player.getScore('ROTplayerUUID', chatmsg.sender.name), [plot.tag]);
        cache.splice(cache.findIndex(tag => plot.tag === tag), 1);
        Object.assign(plotCache, { [chatmsg.sender.name]: cache });
        return Server.broadcast('Your plot has been §creloaded§7!', chatmsg.sender.name, 'PLT');
    }
    if(del.includes(args[1]) && config.letThemDelete) {
        const cache: string[] = plotCache[chatmsg.sender.name];
        deletePlot(Server.player.getScore('ROTplayerUUID', chatmsg.sender.name), [plot.tag]);
        cache.splice(cache.findIndex(tag => plot.tag === tag), 1);
        Object.assign(plotCache, { [chatmsg.sender.name]: cache });
        plt.delete('p-' + plot.id + '-' + Server.player.getScore('ROTplayerUUID', chatmsg.sender.name));
        return Server.broadcast('Your plot has been §4§lWIPED§r§7 and §4§lRESET§r§7!', chatmsg.sender.name, 'PLT');
    }
    Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'PLT');
});
Server.command.register({
    cancelMessage: true,
    name: 'plot',
    description: 'Use this to create advanced plot systems!',
    category: 'building',
    admin: true,
    documentation: {
        usage: 'plot <create|list|delete|set|toggle|rename|clear> <plot> <tag?|distance?|chatTeleport?|structure?|startingPostion?|savePostion?|useRows?|rowSize?|nextRewAmount?|resetArea?|useSpawnTeleport?|spawnTeleport?|friends?|plot?> <name?|X?|Y?|Z?|true?|false?|number?>',
        information: 'It might take you a while to learn this command. This command will let you create mini games like skyblock, plots, skygens, etc... By creating private land pieces for each member in the server when they get a certain tag. You can set the distance for each plot, the starting postion for the first one, how many blocks from the plot location should it save, if it uses rows, or if it teleports them to their plot when they get the tag or join the server. You can also set permission for them to invite people to their plot, and you can change what to do with the plot when the member leaves the game.',
        notes: 'I forgor',
        examples: [
            'plot create <name>',
            'plot set <plot> distance <X-Y-Z>',
            'plot set <plot> structure <name>',
            'plot toggle <plot>',
            'plot list',
            'plot clear <plot> <mmberName>',
            'plot rename <currentName> <newName>',
            'plot set <plot> tag <tag>',
            'plot delete <plot>'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    const create = ['create', 'make', 'start'], list = ['list', 'all', 'tell', 'info', 'information', 'data', 'intel'], del = ['del', 'delete', 'remove', 'yeet'], set = ['set', 'push', 'put'], toggle = ['toggle', 'enable', 'disable', 'on', 'off'], rename = ['rename', 'name', 'rn', 'rname'], clear = ['clear', 'c', 'wipe', 'w', 'begone'];
    if(create.includes(args[0])) {
        if(plt.has(args[1])) return Server.eBroadcast(`This server already has the plot "§4${args[1]}§r§c"!`, chatmsg.sender.name, 'Plotz');
        if(args[1].replace(/[a-zA-Z0-9]/g, '') !== '') return Server.eBroadcast('You cannot use special characters!', chatmsg.sender.name, 'Plotz');
        if(args[2]) return Server.eBroadcast('No spaces in the plot name >:((((((!', chatmsg.sender.name, 'Plotz');
        plt.set(args[1], {
            enabled: 0,
            id: ~~(Math.random() * (1000000 - 1 + 1) + 1),
            resetArea: 0,
            tag: args[1]
        }, true);
        return Server.broadcast(`The plot §c${args[1]}§7 has been created! You can force a player to load their slot by typing "§e/tag "playername" add ${args[1]}§r§7" after you enable it! §cI warn you to make a copy of this server if it's a world because this command isn't too easy for beginners.`, chatmsg.sender.name, 'Plotz');
    }
    if(!args.length || list.includes(args[0])) {
        if(args[1]) {
            if(!plt.has(args[1])) return Server.eBroadcast(`This server doesn\'t has the plot "§4${args[1]}§r§c"!`, chatmsg.sender.name, 'Plotz');
            const plot = plt.get(args[1]),
            plotData = [
                'Plot Mode: §c' + (plot.enabled ? '§1Enabled' : '§4Disabled'),
                'PlotID: §c' + plot.id,
                'Plot Starting Coords: §c' + plot.startingCoords.join(' ') ?? undefined,
                'Plot structure: §c' + plot.structure,
                'Plots distance between each other: §c' + plot.distance.join(' ') ?? undefined,
                'Plot saving distance (The amount of blocks in the X-Y-Z direction from the plot coords should it save): §c' + plot.savingDistance.join(' ') ?? undefined,
                'Chat teleport: §c' + (plot.chatTeleport ? '§1true' : '§4false'),
                'Row size: §c' + plot.rowSize,
                'Distance between rows: §c' + plot.nextRowAmount,
                'Spawn teleport (Teleport the player when loading thier plot): §c' + (plot.useSpawnTeleport ? '§1true' : '§4false'),
                'Spawn teleport coords: §c' + plot.spawnTeleport.join(' ') ?? undefined,
                'Friends (Memebers will be able to invite, remove, give permissions, etc, just social stuff ig, on their plot): §c' + (plot.friends === 1 ? '§1true' : '§4false'),
                'tag: §c' + plot.tag
            ];
            return Server.broadcast(`Displaying all stored data for the plot system §c${args[1]}\n§a ` + plotData.join(`\n §a`), chatmsg.sender.name, 'Plotz');
        }
        if(!plt.allKeys().length) return Server.eBroadcast('You haven\'t set any plots yet!', chatmsg.sender.name, 'Plotz');
        const allPlots: any = plt.allKeys().map(plot => {
            const plotData =  plt.get(plot);
            return `§aPlot system name: §c${plot}\n §aStarting coords: §c${plotData.startingCoords?.join(' ')}\n §aDistance between plots: §c${plotData.distance?.join(' ')}\n §aSaving distance (The amount of blocks in the X-Y-Z direction from the plot coords should it save): §c${plotData.savingDistance?.join(' ')}\n §aArea Reset mode (What happens to the plot after the owner leaves the game and saves the plot): §c${plotData.useSpawnTeleport ? '1' : '0'}`;
        });
        Server.broadcast(`There are a total of §c${allPlots.length}§7 plot systems. Here is all plot systems and some of their data:\n` + allPlots.join(' '), chatmsg.sender.name, 'Plotz');
        return Server.broadcast('If you want more information like the row size, just do "§c!plot info <plot system name>§7" :)', chatmsg.sender.name, 'Plotz');
    }
    if(!args[1]) return Server.eBroadcast('You need to type a plot name!', chatmsg.sender.name, 'Plotz');
    if(!plt.has(args[1])) return Server.eBroadcast(`This server doesn\'t has the plot "§4${args[1]}§r§c"!`, chatmsg.sender.name, 'Plotz');
    const plot = plt.get(args[1]);
    if(del.includes(args[0])) {
        if(args[2] !== 'true') return Server.eBroadcast(`Please type "§4true§c" after the plot system's name to comfirm you want to delete the plot system "§4${args[1]}§c" along with all of the member data.`, chatmsg.sender.name, 'ROT');
        for(const player of world.getPlayers()) {
            const cache: string[] = plotCache[player.nameTag];
            if(!cache?.includes(plot.tag)) continue;
            deletePlot(Server.player.getScore('ROTplayerUUID', player.nameTag), [plot.tag]);
            cache.splice(cache.findIndex(tag => plot.tag === tag), 1);
            Object.assign(plotCache, { [player.nameTag]: cache });
        }
        if(plt.has('l-' + plot.id)) for(const owner of plt.get('l-' + plot.id).split('/r/')) plt.delete('p-' + plot.id + '-' + owner);
        plt.delete('l-' + plot.id);
        plt.delete(args[1]);
        return Server.broadcast(`The plot system "§4${args[1]}§7" and all of it's data has been deleted!`, chatmsg.sender.name, 'Plotz');
    }
    if(set.includes(args[0])) {
        if(!args[1]) return Server.eBroadcast('You need to type a plot name!', chatmsg.sender.name, 'Plotz');
        if(!plt.has(args[1])) return Server.eBroadcast(`This server doesn\'t has the plot "§4${args[1]}§r§c"!`, chatmsg.sender.name, 'Plotz');
        const pos = ['pos', 'postion', 'startingpos', 'start', 'startingpostion', 'p', 'startingCoords'],
            distance = ['d', 'distance', 'length', 'dis', 'dist', 'ds', 'sd'],
            chatTeleport = ['chattp', 'talktp', 'chatteleport', 'ct'],
            str = ['structure', 'struc', 'block', 's', 'str'],
            savingDistance = ['savepos', 'savepostion', 'savpos', 'savd', 'savecoords', 'save'],
            rowSize = ['rowSize', 'row', 'rs', 'rsize', 'rows'],
            nextRowAmount = ['nextrowammount', 'nra', 'nr', 'nextrow', 'rowamount', 'nr0'],
            resetArea = ['resetarea', 'ra', 'leaveArea', 'reset', 'area'],
            spawnTeleport = ['st', 'spawnteleport', 'spawntp', 'stp', 'jointp', 'jointeleport'],
            useSpawnTeleport = ['usest', 'usespawnteleport', 'usest', 'ust', 'usespawntp'],
            friends = ['friends', 'fri', 'people', 'ppl'],
            tag = ['tag', 't', 'tg', 'tgr'];
        if(distance.includes(args[2])) {
            if(!args[5]) return Server.eBroadcast('You need to type the distance between each plot', chatmsg.sender.name, 'Plotz');
            let X = parseInt(args[3]), Y = parseInt(args[4]), Z = parseInt(args[5]);
            if(isNaN(X)||isNaN(Y)||isNaN(Z)) return Server.eBroadcast('That is not a set of coordinates', chatmsg.sender.name, 'Plotz');
            plt.set(args[1], Object.assign(plot, { distance: [X, Y, Z] }));
            return Server.broadcast(`The spawning distance for each plot for §4${args[1]}§7 is now §c${X}§7, §c${Y}§7, §c${Z}§7!`, chatmsg.sender.name, 'Plotz');
        }
        if(chatTeleport.includes(args[2])) {
            plt.set(args[1], Object.assign(plot, { chatTeleport: plot.chatTeleport ? 0 : 1 }));
            return Server.broadcast(`Members §l${plt.get(args[1]).chatTeleport ? '§awill' : '§cwill no longer'}§r§7 be able to teleport to their plot by typing "§c!pl tp ${args[1]}§7" in chat!`, chatmsg.sender.name, 'Plotz');
        }
        if(str.includes(args[2])) {
            if(!args[3]) return Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'Plotz');
            if(args[4]) return Server.eBroadcast('No spaces in the structure name please!', chatmsg.sender.name, 'Plotz');
            plt.set(args[1], Object.assign(plot, { structure: args[3] }));
            return Server.broadcast(`The base structure for §c${args[1]}§r§7 is now §4${args[3]}§r§7!`, chatmsg.sender.name, 'Plotz');
        }
        if(pos.includes(args[2])) {
            let X = parseInt(args[3]), Y = parseInt(args[4]), Z = parseInt(args[5]);
            if(!args[3]) X = ~~chatmsg.sender.location.x, Y = ~~chatmsg.sender.location.y, Z = ~~chatmsg.sender.location.z;
            if(isNaN(X)||isNaN(Y)||isNaN(Z)) return Server.eBroadcast('That is not a set of coordinates!', chatmsg.sender.name, 'Plotz');
            plt.set(args[1], Object.assign(plot, { startingCoords: [X, Y, Z] }));
            return Server.broadcast(`The starting location for the first plot to generate is now §c${X}§7, §c${Y}§7, §c${Z}§7 for §4${args[1]}§7!`, chatmsg.sender.name, 'Plotz');
        }
        if(savingDistance.includes(args[2])) {
            if(!args[5]) return Server.eBroadcast('You need to type the how many blocks in the X-Y-Z format will be saved on the plot', chatmsg.sender.name, 'Plotz');
            let X = parseInt(args[3]), Y = parseInt(args[4]), Z = parseInt(args[5]);
            if(isNaN(X)||isNaN(Y)||isNaN(Z)||X > 64||Z > 64) return Server.eBroadcast('That is not a set of coordinates or either the X or Z value is greater than §464', chatmsg.sender.name, 'Plotz');
            plt.set(args[1], Object.assign(plot, { savingDistance: [X, Y, Z] }));
            return Server.broadcast(`The saving distances for a plot is now §c${X}§7, §c${Y}§7, §c${Z}§7 for §4${args[1]}§7! §4REMEMBER, ROT WILL NOT SAVE, LOAD, OR DELETE ANY BLOCKS OUT SIDE OF THIS!!!`, chatmsg.sender.name, 'Plotz');
        }
        if(rowSize.includes(args[2])) {
            if(isNaN(parseInt(args[3]))) return Server.eBroadcast('That is not a number!', chatmsg.sender.name, 'Plotz');
            if(parseInt(args[3]) === 1) return Server.eBroadcast('The the row size cannot be one!', chatmsg.sender.name, 'Plotz');
            plt.set(args[1], Object.assign(plot, { rowSize: parseInt(args[3]) }));
            return Server.broadcast(`The row size for the plot system §4${args[1]}§7 is now §c${args[3]}§7!`, chatmsg.sender.name, 'Plotz');
        }
        if(nextRowAmount.includes(args[2])) {
            if(!args[5]) return Server.eBroadcast('You need to type the how many blocks away in the X-Y-Z format will the next row generate', chatmsg.sender.name, 'Plotz');
            let X = parseInt(args[3]), Y = parseInt(args[4]), Z = parseInt(args[5]);
            if(isNaN(X)||isNaN(Y)||isNaN(Z)||X > 64||Z > 64) return Server.eBroadcast('That is not a set of coordinates', chatmsg.sender.name, 'Plotz');
            plt.set(args[1], Object.assign(plot, { nextRow: [X, Y, Z] }));
            return Server.broadcast(`The distance between eack row is now §c${X}§7, §c${Y}§7, §c${Z}§7 for §4${args[1]}§7!`, chatmsg.sender.name, 'Plotz');
        }
        if(resetArea.includes(args[2])) {
            plt.set(args[1], Object.assign(plot, { resetArea: plot.resetArea ? 0 : 1 }));
            return Server.broadcast(`When a member leaves the server or get\'s their tag removed, the location of their plot will be ${plt.get(args[1]).useSpawnTeleport === 1 ? 'reverted the origanal plot structure' : 'will be set to air'}.`, chatmsg.sender.name, 'Plotz');
        }
        if(useSpawnTeleport.includes(args[2])) {
            plt.set(args[1], Object.assign(plot, { useSpawnTeleport: plot.useSpawnTeleport ? 0 : 1 }));
            return Server.broadcast(`Members §l${plt.get(args[1]).useSpawnTeleport ? '§awill' : '§cwill no longer'}§r§7 be teleport to their plot when they get the plot tag or join the game!`, chatmsg.sender.name, 'Plotz');
        }
        if(spawnTeleport.includes(args[2])) {
            let X = parseInt(args[3]), Y = parseInt(args[4]), Z = parseInt(args[5]);
            if(!args[3]) X = ~~chatmsg.sender.location.x, Y = ~~chatmsg.sender.location.y, Z = ~~chatmsg.sender.location.z;
            if(isNaN(X)||isNaN(Y)||isNaN(Z)) return Server.eBroadcast('That is not a set of coordinates!', chatmsg.sender.name, 'Plotz');
            plt.set(args[1], Object.assign(plot, { spawnTeleport: [X, Y, Z] }));
            return Server.broadcast(`The player spawning location for §4${args[1]}§7 is now §c${X}§7, §c${Y}§7, §c${Z}§7! Btw I suggest making the block where they spawn to a block like bedrock if you using this system for skyblock - Mo9ses`, chatmsg.sender.name, 'Plotz');
        }
        if(friends.includes(args[2])) {
            plt.set(args[1], Object.assign(plot, { friends: plot.friends ? 0 : 1} ));
            return Server.broadcast(`Members §l${plot.friends ? '§awill' : '§cwill no longer'}§r§7 be able to invite, remove, give permissions, etc (just social stuff ig) on their plot.`, chatmsg.sender.name, 'Plotz');
        }
        if(tag.includes(args[2])) {
            if(!args[3]) {
                plt.set(args[1], Object.assign(plot, { tag: args[1] }));
                return Server.broadcast(`The tag for §c${args[1]}§r§7 has been reset to the default tag §4${args[3]}§r§7!`, chatmsg.sender.name, 'Plotz');
            }
            if(args[4]) return Server.eBroadcast('No spaces in the tag name please!', chatmsg.sender.name, 'Plotz');
            plt.set(args[1], Object.assign(plot, { tag: args[3] }));
            return Server.broadcast(`The tag for §c${args[1]}§r§7 is now §4${args[3]}§r§7!`, chatmsg.sender.name, 'Plotz');
        }
    }
    if(toggle.includes(args[0])) {
        if(!args[1]) return Server.eBroadcast('You need to type a plot name!', chatmsg.sender.name, 'Plotz');
        if(!plt.has(args[1])) return Server.eBroadcast(`This server doesn\'t has the plot "§4${args[1]}§r§c"!`, chatmsg.sender.name, 'Plotz');
        if(!plot.distance) return Server.eBroadcast(`The §4${args[1]}§c's spawning distance between each plot has not been set! You can set it by typing "§4!plot set ${args[1]} distance <X> <Y> <Z>§c" or whatever number you want.`, chatmsg.sender.name, 'Plotz');
        if(!plot.structure) return Server.eBroadcast(`§4${args[1]}§c's base structure is not set! You can set it by typing "§4!plot set ${args[1]} str <structure name>§c".`, chatmsg.sender.name, 'Plotz');
        if(!plot.startingCoords) return Server.eBroadcast(`§4${args[1]}§c's starting postion is not set! You can set it by typing "§4!plot set ${args[1]} pos <X> <Y> <Z>§c".`, chatmsg.sender.name, 'Plotz');
        if(!plot.savingDistance) return Server.eBroadcast(`§4${args[1]}§c's saving distances is not set! You can set it by typing "§4!plot set ${args[1]} savd <X> <Y> <Z>§c".`, chatmsg.sender.name, 'Plotz');
        plt.set(args[1], Object.assign(plot, { enabled: plot.enabled ? 0 : 1 }));
        return Server.broadcast(`§c${args[1]}§r§7 is now §l${plot.enabled ? '§aEnabled' : '§cDisabled'}§r§7!`, chatmsg.sender.name, 'Plotz');
    }
    if(rename.includes(args[0])) {
        plt.set(args[2], plot, true);
        plt.delete(args[1]);
        return Server.broadcast(`The plot system "§c${args[1]}§7" has been renamed to "§c${args[2]}§7" with §4NO§7 data loss!`, chatmsg.sender.name, 'Plotz');
    }
    if(clear.includes(args[0])) {
        if(!args[2]) return Server.broadcast(`You didn\'t type a players name meaning you might want to delete all the player data. Type "§c!plot clear ${args[1]} ${plot.id}§7"`, chatmsg.sender.name, 'Plotz');
        if(!isNaN(parseInt(args[2])) && parseInt(args[2]) === plot.id) {
            for(const player of world.getPlayers()) {
                const cache: string[] = plotCache[player.nameTag];
                if(!cache?.includes(plot.tag)) continue;
                deletePlot(Server.player.getScore('ROTplayerUUID', player.nameTag), [plot.tag]);
                cache.splice(cache.findIndex(tag => plot.tag === tag), 1);
                Object.assign(plotCache, { [player.nameTag]: cache });
            }
            plt.delete('l-' + plot.id);
            if(plt.has('l-' + plot.id)) for(const owner of plt.get('l-' + plot.id).split('/r/')) plt.delete('p-' + plot.id + '-' + owner);
            return Server.broadcast(`The plot system "§c${args[1]}§7", has been cleared of all of it's member data and is now very happy :)!`, chatmsg.sender.name, 'Plot;');
        }
        if(!isNaN(parseInt(args[2]))) return Server.eBroadcast('Did you type the correct reset number?', chatmsg.sender.name, 'Plotz');
        if(!Server.player.find(args.slice(2).join(' '))) return Server.eBroadcast('Sorry, the member you typed in either doesn\'t exist or isn\'t online. You can only clear online players at the moment.', chatmsg.sender.name, 'Plotz');
        const cache: string[] = plotCache[chatmsg.sender.name];
        deletePlot(Server.player.getScore('ROTplayerUUID', chatmsg.sender.name), [plot.tag]);
        cache.splice(cache.findIndex(tag => plot.tag === tag), 1);
        Object.assign(plotCache, { [chatmsg.sender.name]: cache });
        plt.delete('p-' + plot.id + '-' + Server.player.getScore('ROTplayerUUID', args.slice(2).join(' ')));
        return Server.broadcast(`§c${args.slice(2).join(' ')}§7's plot has been cleared on the plot system §4${args[1]}§7!`, chatmsg.sender.name, 'Plotz');
    }
    Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'Plotz');
});
setTickInterval(() => {
    const plots = plt.allValues();
    for(const player of world.getPlayers()) {   
        const id = playerID[player.nameTag], playerUUID = Server.player.getScore('ROTplayerUUID', player.nameTag);
        if(!id || !playerUUID) return;
        plotCache[player.nameTag]?.forEach((tag: string, i: number) => {
            if(Server.player.findTag(tag, player.nameTag)) return;
            const cache = plotCache[player.nameTag];
            deletePlot(playerUUID, [tag]);
            cache.splice(i, 1);
            Object.assign(plotCache, { [player.nameTag]: cache });
        });
        const playerPlots = plots?.filter(plot => plot.enabled && player.getTags().includes(plot?.tag) && !plotCache[player.nameTag]?.includes(plot.tag));
        playerPlots.forEach(plot => {
            const row = plot.rowSize >= 2 ? ~~(id / parseInt(plot.rowSize)) : 0,
                coords = plot.distance.map((pos: number, i: number) => parseInt(plot.startingCoords[i]) + (row >= 1 ? parseInt(plot.nextRow[i]) * row : 0) + (pos * (id - 1)));
            if(!plt.has('p-' + plot.id + '-' + playerUUID)) {
                Server.runCommand(`structure load ${plot.structure} ` + coords.join(' '));
                plt.has('l-' + plot.id) ? plt.set('l-' + plot.id, plt.get('l-' + plot.id) + '/r/' + playerUUID) : plt.set('l-' + plot.id, playerUUID);
            } else Server.runCommand(`structure load "${plot.id + '-' + playerUUID}" ` + coords.join(' '));
            Object.assign(plotCache, { [player.nameTag]: plotCache?.[player.nameTag] ? [plotCache[player.nameTag], plot.tag].flat() : [ plot.tag ] });
            plt.set('p-' + plot.id + '-' + playerUUID, Object.assign(plt.get('p-' + plot.id + '-' + playerUUID) ?? {}, { ownerUUID: playerUUID, id: id }));
            if(plot?.useSpawnTeleport) Server.player.fetch(player.nameTag).teleport(new Location(coords[0] + plot?.spawnTeleport[0], coords[1] + plot?.spawnTeleport[1], coords[2] + plot?.spawnTeleport[2]), world.getDimension('overworld'), 0, 0);
            savePlot(playerUUID);
        });
    }
}, 20);
setTickInterval(() => Server.player.list().forEach(player => savePlot(Server.player.getScore('ROTplayerUUID', player))), config.plotSaveTime * 20);
/**
 * Saves all the plots that a members' UUID holds
 * @param {number} playerUUID The ROT UUID of the player
 * @returns {void}
 * @example deletePlot(29223);
 */
const savePlot = (playerUUID: number, plotTag?: string[]) => plt.allValues()?.filter(plot => plotTag?.includes(plot.tag) ?? true)?.forEach(plot => {
    if(!plot.enabled || !plt.has('p-' + plot.id + '-' + playerUUID)) return;
    const id = plt.get('p-' + plot.id + '-' + playerUUID).id, row = plot.rowSize >= 2 ? ~~(id / plot.rowSize) : 0, coords = plot.distance.map((pos: number, i: number) => plot.startingCoords[i] + (row >= 1 ? plot.nextRow[i] * row : 0) + (pos * (id - 1)));
    Server.runCommand(`structure save "${plot.id + '-' + playerUUID}" ${coords.join(' ')} ${coords[0] + plot.savingDistance[0]} ${coords[1] + plot.savingDistance[1]} ${coords[2] + plot.savingDistance[2]} disk`);
}),
/**
 * Deletes all the plots that a members' UUID holds
 * @param {number} playerUUID The ROT UUID of the player
 * @param {string[]} plotTag The tag of the plot
 * @returns {void}
 * @example deletePlot(09822);
 */
deletePlot = (playerUUID: number, plotTag?: string[]) => plt.allValues()?.filter(plot => plotTag?.includes(plot.tag) ?? true)?.forEach(plot => {
    if(!plot.enabled || !plt.has('p-' + plot.id + '-' + playerUUID)) return;
    const id = plt.get('p-' + plot.id + '-' + playerUUID).id, row = plot.rowSize >= 2 ? ~~(id / plot.rowSize) : 0;
    let coords = plot.distance.map((pos: number, i: number) => plot.startingCoords[i] + (row >= 1 ? plot.nextRow[i] * row : 0) + (pos * (id - 1)));
    coords.push(coords[0] + plot.savingDistance[0], coords[1] + plot.savingDistance[1], coords[2] + plot.savingDistance[2]);
    Server.runCommand(`tickingarea add ${coords.join(' ')} "ROTplotSystems-${plot.id}-${id}"`);
    const neg = plot.savingDistance[1] < 0 ? true : false, yLevel = Math.abs(coords[1]) + Math.abs(plot.savingDistance[1]);
    for(let l = Math.abs(coords[1]); l <= yLevel; l++) Server.runCommand(`fill ${coords[0]} ${neg ? -l : l} ${coords.slice(2, 4).join(' ')} ${neg ? -l : l} ${coords[5]} air 0`);
    if(plot.resetArea) Server.runCommand(`structure load ${plot.structure} ` + coords.slice(-3).join(' '));
    Server.runCommand(`tickingarea remove "ROTplotSystems-${plot.id}-${id}"`);
});