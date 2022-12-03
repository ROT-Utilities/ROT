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
import { Location, world } from '@minecraft/server';
import { staticBook, staticValues } from './CommandTypes.js';
import { lang } from '../LangPaper.js';
import Server from '../../ServerBook.js';
import quick from '../DatabasePaper.js';
import { MS, timeRegex } from '../paragraphs/ConvertersParagraphs.js';
/**
 * This is what initiates the commands
*/
world.events.beforeChat.subscribe(data => {
    data.cancel = true;
    if (!data.message.startsWith(quick.prefix)) {
        const player = Server.player.paperPlayer(data.sender, { from: 'CHAT' });
        if (data.message.startsWith(quick.prefix))
            return player.error(lang.cmd.wrongPrefix);
        if (data.sender.hasTag('mute'))
            return player.error(lang.chat.mutted);
        if (data.message.trim() === '')
            return;
        return data.cancel = false;
    }
    const args = data.message.slice(quick.prefix.length).trim().split(/\s+/), command = args.shift().toLowerCase();
    Server.command.run(command, Server.player.paperPlayer(data.sender, { from: command }), args);
});
export const commands = [];
const endCommand = {};
/*
 * Welcome to the CommandPaper!
 * Main Developer: Mo9ses
 * Sub developer: notbeer
 * Link to name: Command Paper
*/
export class CommandPaper {
    /**
     * Creates a command and saves it to memeory
     * @param info The command meta data
     * @example .create({ name: 'cmd' }).callback(plr => console.warn(plr.name));
     * @returns {command}
     */
    create(info) {
        var _a, _b, _c, _d;
        if (info.name.replace(/[a-zA-Z0-9-_ ]/g, '').length)
            throw Error(`Cannot create command "${info.name}". Command names cannot have special symbols or characters.`);
        if (commands.some(cmd => cmd.name === info.name))
            throw Error(`Cannot create command "${info.name}" because there is already a command with that name.`);
        return new command({
            name: info.name,
            description: (_a = info.description) !== null && _a !== void 0 ? _a : 'Basic command description',
            aliases: (_b = info.aliases) !== null && _b !== void 0 ? _b : [],
            category: (_c = info.category) !== null && _c !== void 0 ? _c : 'uncategorized',
            developers: (_d = info.developers) !== null && _d !== void 0 ? _d : ['Mo9ses']
        });
    }
    /**
     * Formats arguments allow the command builder to read command easier
     * @param {string[]} args Args before correction
     * @returns {string[]} Args after correction
     */
    parseArgs(args) {
        //Check for \"
        const output = [], quotes = [];
        args.forEach(a => {
            if (quotes.length)
                if (a.includes('"')) {
                    output.push(`${quotes.join(' ')} ${a.replace('"', '')}`);
                    return quotes.splice(0, quotes.length);
                }
                else
                    return quotes.push(a);
            if (!a.includes('"'))
                return output.push(a);
            const na = a.replace('"', '');
            if (na.includes('"'))
                output.push(na.replace('"', ''));
            else
                quotes.push(na);
        });
        if (quotes.length)
            return null;
        return output;
    }
    /**
     * Finds the next argument of the command and returns it
     * @param {commandData} cmd The command that you are searching in
     * @param {string[]} nextArgs The names of the known next arguments
     * @param {string[]} args The given arguments (The args the player typed)
     * @example .findType(cmd, player, ['create', 'delete', 'list'], ['create', 'moss']);
     * @returns { aRN: string, tV: any, aR: string[] }
     * Argument name, value, next args (from player)
     */
    findType(cmd, player, nextArgs, args) {
        var _a, _b, _c, _d;
        for (const a of nextArgs) {
            if (!['sta', 'dyn'].includes(cmd.aR[a].tY))
                continue;
            if (cmd.aR[a].tY === 'sta') {
                if (cmd.aR[a].tV[0].includes(args[0]))
                    return { aRN: a, tV: args[1], nA: args.slice(cmd.aR[a].tV[1] ? 2 : 1) };
                if (staticBook[cmd.aR[a].tV[0]].val.includes(args[0]))
                    return { aRN: a, tV: args[1], nA: args.slice(cmd.aR[a].tV[1] ? 2 : 1) };
                continue;
            }
            const res = cmd.aR[a].tV[0].find((v) => v === '*' || args.slice(0, v.split(' ').length).join(' ') === v);
            if (res)
                return { aRN: a, tV: cmd.aR[a].tV[2] ? args.slice(0, cmd.aR[a].tV[2]) : cmd.aR[a].tV[0].includes('*') ? args.slice(0, res.split(' ').length).join(' ') : args[0], nA: cmd.aR[a].tV[2] ? args.slice(cmd.aR[a].tV[2]) : args.slice(res.split(' ').length) };
        }
        ;
        const argTypes = {};
        (_a = nextArgs === null || nextArgs === void 0 ? void 0 : nextArgs.filter(a => !['sta', 'dyn'].includes(cmd.aR[a].tY))) === null || _a === void 0 ? void 0 : _a.forEach(a => Object.assign(argTypes, { [cmd.aR[a].tY]: a }));
        const allTypes = Object.keys(argTypes);
        if (allTypes.includes('plr')) {
            if (args[0] === '@s' && cmd.aR[argTypes['plr']].tV[2])
                return { aRN: argTypes['plr'], tV: cmd.aR[argTypes['plr']].tV[1] ? player : player.nameTag, nA: args.slice(1) };
            let val = Array.from(world.getPlayers()).find(p => p.nameTag.toLowerCase() === args[0].toLowerCase());
            if (cmd.aR[argTypes['plr']].tV[1])
                val = val ? Server.player.paperPlayer(val, cmd.aR[argTypes['plr']].tV[0]) : null;
            else
                val = args[0];
            if (val)
                return { aRN: argTypes['plr'], tV: val, nA: args.slice(1) };
        }
        if (allTypes.includes('boo')) {
            if (['true', 't-'].includes(args[0]))
                return { aRN: argTypes['boo'], tV: true, nA: args.slice(1) };
            if (['false', 'f-'].includes(args[0]))
                return { aRN: argTypes['boo'], tV: false, nA: args.slice(1) };
        }
        if (allTypes.includes('loc')) {
            let loc = [], left = args.join(' ');
            for (let i = 0; i < 3; i++) {
                let num = left.match(/([+-]?\d+(?:.\d+)?[eE]-?\d+)|([+-]?\d+(?:\.\d+)?)|(([\~\^][+-]?\d+(?:\.\d+)?){1,3}|(~|\^)?)/)[0];
                if (!num)
                    continue;
                if (num.startsWith('~'))
                    loc[i] = Number(num.replace('~', '')) + player.location[i == 0 ? 'x' : i == 1 ? 'y' : 'z'];
                else if (num.startsWith('^'))
                    loc[i] = Number(num.replace('^', '')) + player.viewVector[i == 0 ? 'x' : i == 1 ? 'y' : 'z']; //To be finished
                else
                    loc[i] = Number(num);
                left = left.replace(`${num}`, '').trim();
            }
            if (loc.length === 3)
                return { aRN: argTypes['loc'], tV: new Location(loc[0], loc[1], loc[2]), nA: args.slice(3) };
        }
        if (allTypes.includes('num') && !isNaN(parseInt(args[0])))
            return { aRN: argTypes['num'], tV: Number(args[0]), nA: args.slice(1) };
        if (allTypes.includes('tim'))
            if (cmd.aR[argTypes['tim']].nA.some(a => cmd.aR[a].tY === 'tim')) {
                let time = 0, left = args[0], testing = true;
                while (testing) {
                    const test = (_c = (_b = left[0]) === null || _b === void 0 ? void 0 : _b.match(timeRegex)) === null || _c === void 0 ? void 0 : _c[0];
                    if (!test) {
                        left = left.replace(test, '').trim();
                        time = time + MS(test);
                        continue;
                    }
                    else
                        testing = false;
                }
                if (left === args[0])
                    return { aRN: argTypes['tim'], tV: time, nA: args.slice(1) };
            }
            else {
                let i = -1, test = true, output = 0;
                while (test) {
                    i = i + 1;
                    let left = args[i], testing = true;
                    while (testing) {
                        const test = (_d = left === null || left === void 0 ? void 0 : left.match(timeRegex)) === null || _d === void 0 ? void 0 : _d[0];
                        if (!test) {
                            left = left.replace(test, '').trim();
                            output = output + MS(test);
                            continue;
                        }
                        else
                            testing = false;
                    }
                    if (left === args[i])
                        test = false;
                }
                if (i > -1)
                    return { aRN: argTypes['tim'], tV: output, nA: args.slice(i + 1) };
            }
    }
    findExample(type, player) {
        var _a, _b, _c, _d;
        if (!type)
            return;
        if (type.tY === 'sta')
            return staticBook[type.tV[0]].val[0];
        if (type.tY === 'dyn')
            return type.tV[0][0];
        if (type.tY === 'plr')
            return Array.from(world.getPlayers(), plr => plr.nameTag).find(n => n !== player.nameTag) || '@s';
        if (type.tY === 'num')
            return `${type.tV ? ~~(Math.random() * (((_a = type.tV) === null || _a === void 0 ? void 0 : _a.max) || (((_b = type.tV) === null || _b === void 0 ? void 0 : _b.min) + 5) || 15)) + ((_c = type.tV) === null || _c === void 0 ? void 0 : _c.min) || (((_d = type.tV) === null || _d === void 0 ? void 0 : _d.max) - 5) || -15 : 0}`;
        if (type.tY === 'loc')
            return '~ ~ ~';
        if (type.tY === 'boo')
            return 'true';
        if (type.tV === 'tim')
            return '';
        return;
    }
    /**
     * Runs a ROT command on a player with args
     * @param {string} command The name of the command they type in
     * @param {newPlayer} player The player data
     * @param {string[]} args The given arguments (The args the player typed)
     * @example .run('warp', player, ['create', 'epic loser']);
     * @returns {void}
     */
    run(command, player, args) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const cmd = commands.find(cmd => cmd.name === command || cmd.aliases && cmd.aliases.includes(command)), time = new Date().getTime();
        if (!cmd || !cmd.rM.cM)
            return player.error(lang.cmd.unknown, 'ROT');
        if ((cmd.admin && !player.hasTag(quick.adminTag)) || (((_a = cmd.tags) === null || _a === void 0 ? void 0 : _a.length) && !cmd.tags.some(t => player.hasTag(t))))
            return player.error(lang.cmd.noPerms, 'ROT');
        if (!cmd.sT[0].length && args.length)
            return player.error(lang.cmd.noArgs, 'ROT');
        if (cmd.sT[1] && !args.length)
            return player.error(lang.cmd.missingArgs(command, args, this.findExample(cmd.aR[cmd.sT[0][0]], player)), 'ROT');
        const cls = {}, output = this.parseArgs(args);
        if (!output)
            return player.error(lang.cmd.openQou);
        let fetchCLs = true, tries = 0, nextArgs = output;
        while (fetchCLs) {
            if (!nextArgs.length)
                fetchCLs = false;
            if (!fetchCLs)
                continue;
            const nAR = !tries ? cmd.sT[0] : (_b = cmd.aR[Object.keys(cls).reverse()[0]]) === null || _b === void 0 ? void 0 : _b.nA;
            if (!(nAR === null || nAR === void 0 ? void 0 : nAR.length) && nextArgs.length)
                return player.error(lang.cmd.maxArgs(nextArgs[0]), 'ROT');
            const type = this.findType(cmd, player, nAR, nextArgs), arg = (type === null || type === void 0 ? void 0 : type.aRN) ? cmd.aR[type.aRN] : null;
            if (!arg)
                return player.error(lang.cmd.notAArg(command, args.slice(0, args.length - nextArgs.length), nextArgs[0], nextArgs.slice(1).join(' '), this.findExample(cmd.aR[nAR[0]], player)), 'ROT');
            if (arg.nN && !type.nA.length)
                if (cmd.aR[type.aRN].nA.some(a => cmd.aR[a].tY === 'plr' && cmd.aR[a].tV[2]))
                    Object.assign(type, { nA: ['@s'] });
                else
                    return player.error(lang.cmd.missingArgs(command, args, this.findExample(cmd.aR[arg.nA[0]], player)));
            if (['dyn', 'sta'].includes(arg.tY) && !((_c = type.tV) === null || _c === void 0 ? void 0 : _c.length) && arg.tV[1])
                return player.error(lang.cmd.needVal(arg.tV[0]), 'ROT'); //Might need fixing
            if (arg.tY === 'sta' && ((_e = !((_d = staticBook[arg.tV[0]]) === null || _d === void 0 ? void 0 : _d.con(type.tV))) !== null && _e !== void 0 ? _e : false))
                return player.error((_g = (_f = staticBook[arg.tV[0]]) === null || _f === void 0 ? void 0 : _f.err) !== null && _g !== void 0 ? _g : lang.cmd.valErr(arg.tV[0]), command);
            if (((_h = arg.tG) === null || _h === void 0 ? void 0 : _h.length) && !arg.tG.some(t => player.hasTag(t)))
                return player.error(lang.cmd.noArgPerm, 'ROT');
            Object.assign(cls, { [type.aRN]: [type.tV, type.nA] });
            //Make timeTye work like "1 day 2 years 5 hours"
            nextArgs = type.nA;
            tries++;
        }
        try {
            if (cmd.cB)
                cmd.cB(player, args);
            (_j = Object.keys(cls)) === null || _j === void 0 ? void 0 : _j.forEach(arg => {
                if (!Object.keys(endCommand).includes(cmd.name))
                    return cmd.aR[arg].cB ? cmd.aR[arg].cB(player, cls[arg][0], cls[arg][1]) : null;
                endCommand[cmd.name](player);
            });
        }
        catch (e) {
            console.warn(`${e}:${e.stack}`);
        }
        console.warn(`Operation compeleted in ${new Date().getTime() - time} MS!`);
        delete endCommand[cmd.name];
    }
    /**
     * Makes a command show up as a FormUI for a player
     * @param {string} cmd The name of the command
     * @param {newPlayer} player The player
     * @example .form(playerToPaper(data.sender, { from: warp }), 'warp');
     * @returns {void}
     */
    form(cmd, player) {
        var _a;
        const time = new Date().getTime();
        if ((cmd.admin && !player.hasTag(quick.adminTag)) || (((_a = cmd.tags) === null || _a === void 0 ? void 0 : _a.length) && !cmd.tags.some(t => player.hasTag(t))))
            return player.error(lang.cmd.noPerms, 'ROT');
        if (!cmd.sT[0].length)
            return;
    }
    /**
     * Register a command into ROT
     * @param {command} command The command
     * @example .register(.create({ name: 'nothing' }));
     * @returns {void}
     */
    map(cmd) {
        return;
    }
}
/**
 * The command class
 */
//Add bridgeType to the command builder
class command {
    constructor(information) {
        commands.push(Object.assign(information, {
            sT: [[], false],
            aR: {},
            cB: null,
            rM: { cM: true, fM: true, tG: true },
        }));
        this.name = information.name;
        this.index = commands.findIndex(c => c.name === this.name);
    }
    /**
     * Runs a function if the command is execute successfully (Before the arg callbacks)
     * @param {ArrowFunction | Function} callback The function
     * @example .callback((player, args) => console.warn(`${player.ranks()} ${args.join(' ')}`));
     * @returns {command}
     */
    callback(callback) {
        commands[this.index].cB = callback;
        return this;
    }
    /**
     * This will escape/end the argument and command
     * @example .end();
     * @returns {void}
     */
    end(callback) {
        Object.assign(endCommand, { [this.name]: callback });
    }
    /**
     * The starting argument(s) for the command. This is required if you have arguments
     * @param {string | string[]} args The name of the argument(s)
     * @param {boolean} needArg If the command needs arguments or not
     * @example .startingArgs(['tpa send', 'tpa accept'], true);
     * @returns {command}
     */
    startingArgs(args, needArg) {
        let arg = [args].flat(), test = [];
        arg.forEach(a => !test.includes(a) && test.push(a));
        if (arg.length !== test.length)
            throw Error(`Please check your starting args for "${this.name}"!`);
        commands[this.index].sT = [arg, needArg !== null && needArg !== void 0 ? needArg : true];
        return this;
    }
    /**
     * The possible ways the command be ran
     * @param {boolean} cmd If you can type the command in chat to run it
     * @param {boolean} form Can you run it in a FormUI?
     * @param {boolean} tag Give yourself the tag to run it?
     * @example .relayMethod({ cmd: false, tag: false });
     * @returns {command}
     */
    relayMethod({ cmd, form, tag }) {
        const rM = commands[this.index].rM;
        if (cmd !== undefined && rM.cM !== cmd)
            commands[this.index].rM.cM = cmd;
        if (form !== undefined && rM.fM !== form)
            commands[this.index].rM.fM = form;
        if (tag !== undefined && rM.tG !== tag)
            commands[this.index].rM.tG = tag;
        return this;
    }
    /**
     * Creates a static argument. Create, remove, etc.. Are static arguments
     * @param {string} name The name of the argument
     * @param {string} type The type of the static argument. If your not using TS you will probably be lost
     * @param {ArrowFunction | Function} callback The function that runs after the argument is found
     * @param {string | string[]} nextArgs The name of next argument(s) that will run afther this
     * @param {boolean} needValue If a value is required. "!warp create home", home would be the value
     * @param {boolean} needNextArg If the next argument(s) from before are needed
     * @example .staticType('step sis', (plr, str, args) => {
     * <tab> console.warn(str); //Will warn what they typed after the static type if asked
     * }, ['step bro'], true);
     * @returns {command}
     */
    staticType(name, type, callback, nextArgs, needValue, needNextArg) {
        if (Object.keys(commands[this.index].aR).includes(name))
            throw Error(`Failed to add argument "${name}" to "${this.name}". This argument/type already exists!`);
        const nA = nextArgs ? [nextArgs].flat() : [];
        Object.assign(commands[this.index].aR, { [name]: {
                tY: 'sta',
                tV: [type, needValue !== null && needValue !== void 0 ? needValue : true],
                cB: callback !== null && callback !== void 0 ? callback : null,
                nA: nA,
                nN: nA.length ? needNextArg !== null && needNextArg !== void 0 ? needNextArg : Boolean(nA === null || nA === void 0 ? void 0 : nA.length) : false
            } });
        return this;
    }
    /**
     * Creates a boolean argument
     * @param {string} name The name of the argument
     * @param {ArrowFunction | Function} callback The function that runs after the argument is found
     * @param {string | string[]} nextArgs The name of the next argument(s) that will run afther this
     * @param {boolean} needNextArg If the next argument(s) from before are needed
     * @example .booleanType('hello', (plr, boo, args) => {
     * <tab> console.warn(plr.nameTag);
     * }, ['hi 2.0'], true);
     * @returns {command}
     */
    booleanType(name, callback, nextArgs, needNextArg) {
        if (Object.keys(commands[this.index].aR).includes(name))
            throw Error(`Failed to add argument "${name}" to "${this.name}". This argument/type already exists!`);
        const nA = nextArgs ? [nextArgs].flat() : [];
        Object.assign(commands[this.index].aR, { [name]: {
                tY: 'boo',
                cB: callback !== null && callback !== void 0 ? callback : null,
                nA: nA,
                nN: nA.length ? needNextArg !== null && needNextArg !== void 0 ? needNextArg : Boolean(nA === null || nA === void 0 ? void 0 : nA.length) : false
            } });
        return this;
    }
    /**
     * Creates a location argument
     * @param {string} name The name of the argument
     * @param {ArrowFunction | Function} callback The function that runs after the argument is found
     * @param {string | string[]} nextArgs The name of the next argument(s) that will run afther this
     * @param {boolean} loaded Checks if the chucks in that location are loaded
     * @param {boolean} needNextArg If the next argument(s) from before are needed
     * @example .locationType('Hmm', (plr, loc, args) => {
     * <tab> console.warn(loc); //Example output: [9, 10, -91]
     * }, ['Ok!'], true);
     * @returns {command}
     */
    locationType(name, callback, nextArgs, loaded, needNextArg) {
        if (Object.keys(commands[this.index].aR).includes(name))
            throw Error(`Failed to add argument "${name}" to "${this.name}". This argument/type already exists!`);
        const nA = nextArgs ? [nextArgs].flat() : [];
        Object.assign(commands[this.index].aR, { [name]: {
                tY: 'loc',
                tV: loaded !== null && loaded !== void 0 ? loaded : true,
                cB: callback !== null && callback !== void 0 ? callback : null,
                nA: nA,
                nN: nA.length ? needNextArg !== null && needNextArg !== void 0 ? needNextArg : Boolean(nA === null || nA === void 0 ? void 0 : nA.length) : false
            } });
        return this;
    }
    /**
     * Creates a number argument
     * @param {string} name The name of the argument
     * @param {ArrowFunction | Function} callback The function that runs after the argument is found
     * @param {string | string[]} nextArgs The name of the next argument(s) that will run afther this
     * @param {numberType} data The required number value
     * @param {boolean} needNextArg If the next argument(s) from before are needed
     * @example .numberType('rate ROT', (plr, num, args) => {
     * <tab> console.warn(num); //Output: number
     * }, [], [0, 10]);
     * @returns {command}
     */
    numberType(name, callback, nextArgs, data, needNextArg) {
        if (Object.keys(commands[this.index].aR).includes(name))
            throw Error(`Failed to add argument "${name}" to "${this.name}". This argument/type already exists!`);
        if (data && data.min > data.max)
            throw Error(`Argument "${name}" from command "${this.name}" cannot have a min value greater than the max.`);
        const nA = nextArgs ? [nextArgs].flat() : [];
        Object.assign(commands[this.index].aR, { [name]: {
                tY: 'num',
                tV: data !== null && data !== void 0 ? data : null,
                cB: callback !== null && callback !== void 0 ? callback : null,
                nA: nA,
                nN: nA.length ? needNextArg !== null && needNextArg !== void 0 ? needNextArg : Boolean(nA === null || nA === void 0 ? void 0 : nA.length) : false
            } });
        return this;
    }
    /**
     * Creates a player argument
     * @param {string} name The name of the argument
     * @param {ArrowFunction | Function} callback The function that runs after the argument is found
     * @param {boolean} online If the player has to be in the server
     * @param {string | string[]} nextArgs The name of the next argument(s) that will run afther this
     * @param {playerData} data Optional player data
     * @param {boolean} needNextArg If the next argument(s) from before are needed
     * @example .playerType('test1', (plr, plr2, args) => {
     * <tab> plr2.kill(); //Kills the player with the name they typed
     * }, ['test2']);
     * @returns {command}
     */
    playerType(name, callback, online, nextArgs, data, self, needNextArg) {
        if (Object.keys(commands[this.index].aR).includes(name))
            throw Error(`Failed to add argument "${name}" to "${this.name}". This argument/type already exists!`);
        const nA = nextArgs ? [nextArgs].flat() : [];
        Object.assign(commands[this.index].aR, { [name]: {
                tY: 'plr',
                tV: [data !== null && data !== void 0 ? data : {}, online !== null && online !== void 0 ? online : true, self !== null && self !== void 0 ? self : true],
                cB: callback !== null && callback !== void 0 ? callback : null,
                nA: nA,
                nN: nA.length ? needNextArg !== null && needNextArg !== void 0 ? needNextArg : Boolean(nA === null || nA === void 0 ? void 0 : nA.length) : false
            } });
        return this;
    }
    /**
     * Creates a dynamic argument
     * @param {string} name The name of the argument
     * @param {ArrowFunction | Function} callback The function that runs after the argument is found
     * @param {string | string[]} nextArgs The name of the next argument(s) that will run afther this
     * @param {boolean} needValue If the arg after this one will be need and returned as a value
     * @param {number} length The number of args it will return as a value (Will not be processed if needValue is false or undefined)
     * @param {boolean} needNextArg If the next argument(s) from before are needed
     * @example .dynamicType('hello', 'BOI WHAT THE HELLLLL', (plr, str, args) => {
     * <tab> console.warn(string); //Output: [9, 10, -91]
     * }, ['hi 2.0'], true);
     * @returns {command}
     */
    dynamicType(name, data, callback, nextArgs, needValue, length, needNextArg) {
        if (Object.keys(commands[this.index].aR).includes(name))
            throw Error(`Failed to add argument "${name}" to "${this.name}". This argument/type already exists!`);
        const val = [data].flat();
        if (val.some(v => staticValues.includes(v)))
            throw Error(`Dynamic argument "${name}" from command "${this.name}" can't have a value that is already in a static type.`);
        const nA = nextArgs ? [nextArgs].flat() : [];
        if (nA.includes('*') && nA.length > 1)
            throw Error(`Dynamic argument "${name}" from command "${this.name}" can't take any argument if it has multiple argument aliases`);
        Object.assign(commands[this.index].aR, { [name]: {
                tY: 'dyn',
                tV: [val, needValue !== null && needValue !== void 0 ? needValue : false, length !== null && length !== void 0 ? length : 0],
                cB: callback !== null && callback !== void 0 ? callback : null,
                nA: nA,
                nN: nA.length ? needNextArg !== null && needNextArg !== void 0 ? needNextArg : Boolean(nA === null || nA === void 0 ? void 0 : nA.length) : false,
                tG: []
            } });
        return this;
    }
    /**
     * Creates a time argument
     * @param {string} name The name of the argument
     * @param {ArrowFunction | Function} callback The function that runs after the argument is found
     * @param {string | string[]} nextArgs The name of the next argument(s) that will run afther this
     * @param {numberType} data The constraits
     * @param {boolean} needNextArg If the next argument(s) from before are needed
     * @example .timeType('rate ROT', (plr, ms, args) => {
     * <tab> console.warn(num); //Output: number
     * }, [], [0, 10]);
     * @returns {command}
     */
    timeType(name, callback, nextArgs, data, needNextArg) {
        if (Object.keys(commands[this.index].aR).includes(name))
            throw Error(`Failed to add argument "${name}" to "${this.name}". This argument/type already exists!`);
        const nA = nextArgs ? [nextArgs].flat() : [];
        Object.assign(commands[this.index].aR, { [name]: {
                tY: 'tim',
                tV: data !== null && data !== void 0 ? data : null,
                cB: callback !== null && callback !== void 0 ? callback : null,
                nA: nA,
                nN: nA.length ? needNextArg !== null && needNextArg !== void 0 ? needNextArg : Boolean(nA === null || nA === void 0 ? void 0 : nA.length) : false
            } });
        return this;
    }
    teamType(name, argNames, callback, nextArgs, needNextArg) {
        if (Object.keys(commands[this.index].aR).includes(name))
            throw Error(`Failed to add teamType "${name}" to "${this.name}". This argument/type already exists!`);
        const val = [argNames].flat(), nA = nextArgs ? [nextArgs].flat() : [];
        Object.assign(commands[this.index].aR, { [name]: {
                tY: 'tem',
                tV: val,
                cB: callback !== null && callback !== void 0 ? callback : null,
                nA: nA,
                nN: nA.length ? needNextArg !== null && needNextArg !== void 0 ? needNextArg : Boolean(nA === null || nA === void 0 ? void 0 : nA.length) : false,
                tG: []
            } });
        return this;
    }
    /**
     * Configures the arguments that you select
     * @param {string | string[]} argNames The name of the arguments
     * @param {argConfig} info The new information
     * @returns {command}
     */
    argConfig(argNames, info) {
        const args = [argNames].flat();
        args.forEach(a => {
            var _a, _b, _c;
            const arg = commands[this.index].aR[a], tags = info.tags ? info.tags : (_a = arg === null || arg === void 0 ? void 0 : arg.tG) !== null && _a !== void 0 ? _a : [];
            if (info.admin)
                tags.push(quick.adminTag);
            if (!arg)
                throw Error(`Failed editing argument "${a}" from command "${this.name}" because it does not exist!`);
            Object.assign(commands[this.index].aR[a], {
                nA: (_b = info.nextArgs) !== null && _b !== void 0 ? _b : arg.nA,
                tG: tags,
                nN: (_c = info.needNextArgs) !== null && _c !== void 0 ? _c : arg.nN
            });
        });
        return this;
    }
}
/**
 * Checks ROT command arguments for imperfections
 */
world.events.worldInitialize.subscribe(() => commands.forEach((cmd, i) => {
    try {
        const length = Object.keys(cmd.aR).length, fakeArgs = cmd.aR;
        if (length && !cmd.sT[0].length)
            throw Error(`Command "${cmd.name}" has no starting args, but has args.`);
        if (!length && cmd.sT[0].length)
            throw Error(`Command "${cmd.name}" has starting args, but no args.`);
        if (cmd.sT[0].some(a => !cmd.aR.hasOwnProperty(a)))
            console.warn(`Some of the starting arguments for the command "${cmd.name}" don't exist!`);
        Object.assign(fakeArgs, { '... I mean Starting Arguements': { nA: cmd.sT[0] } });
        for (const arg in fakeArgs) {
            if (fakeArgs[arg].nN && !fakeArgs[arg].nA.length)
                throw Error(`Argument "${arg}" from command "${cmd.name}" needs next args but, there are no args afther it.`);
            const realArgs = fakeArgs[arg].nA.filter(a => cmd.aR.hasOwnProperty(a));
            if (fakeArgs[arg].nA.length !== realArgs.length)
                throw Error(`Argument "${arg}" from command "${cmd.name}" is asking for next argument(s) that don't exist!`);
            const argTypes = realArgs.map(a => ['sta', 'dyn'].includes(cmd.aR[a].tY) ? '' : cmd.aR[a].tY), test = [];
            argTypes.forEach(t => (!test.includes(t) || t === '') && test.unshift(t));
            if (test.length !== argTypes.length)
                throw Error(`Argument "${arg}" from command "${cmd.name}" has two of the same types for the next arg!`);
        }
    }
    catch (e) {
        console.warn(e);
        commands.splice(i, 1);
    }
}));
