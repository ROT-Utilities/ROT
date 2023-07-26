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
© Copyright 2023 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Website: https://www.rotmc.ml
Thank you!
*/
import { system, world } from '@minecraft/server';
import { MS, timeRegex } from '../Paragraphs/ConvertersParagraphs.js';
import { staticBook, staticValues } from './argumentTypes.js';
import { ActionForm } from '../FormPaper.js';
import Player from '../PlayerPaper.js';
import quick from '../../quick.js';
import lang from '../LangPaper.js';
/*
 * Welcome to the CommandPaper!
 * Main Developer: Mo9ses
 * Sub developer: Nobody!
 * Link to name: Command Paper
*/
export class CommandPaper {
    /**
     * Creating a new handle
     * @param prefix The prefix
     */
    constructor(prefix) {
        this.list = [];
        this.endQueue = {};
        this.forceQueue = {};
        this.prefix = prefix;
    }
    /**
     * Creates a command and saves it to memeory
     * @param info The command meta data
     * @example .create({ name: 'cmd' }).callback(plr => console.warn(plr.name));
     * @returns {command}
     */
    create(info) {
        if (info.name.replace(/[a-zA-Z0-9-_ ]/g, '').length)
            throw console.warn(`Cannot create command "${info.name}". Command names cannot have special symbols or characters.`);
        const oldIndex = this.list.findIndex(cmd => cmd.name === info.name);
        if (oldIndex >= 0) {
            this.list.splice(oldIndex, 1);
            console.warn(`Command ${info.name} has been overwritten`);
        }
        if (info.aliases && this.list.some(cmd => cmd.aliases && cmd.aliases.some(a => info.aliases.some(c => a === c))))
            throw console.warn(`Cannot create command "${info.name}" because there is already a command with that alias.`);
        return new command(Object.assign(info, {
            name: info.name.toLowerCase(),
            description: info.description ?? 'Basic command description',
            aliases: info.aliases?.map(a => a.toLowerCase()) ?? [],
            category: info.category ? info.category[0].toUpperCase() + info.category.slice(1).toLowerCase() : 'uncategorized',
            developers: info.developers ?? ['Mo9ses']
        }), this);
    }
    /**
     * Formats arguments allow the command builder to read command easier
     * @param {string[]} args Args before correction
     * @returns {string[]} Args after correction
     */
    parseArgs(args) {
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
            return;
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
        for (const a of nextArgs) {
            if (!['sta', 'dyn'].includes(cmd.aR[a].tY))
                continue;
            if (cmd.aR[a].tY === 'sta')
                if (staticBook[cmd.aR[a].tV[0]].val.includes(args[0]))
                    return { aRN: a, tV: cmd.aR[a].tV[1] ? args[1] : cmd.aR[a].tV[0], nA: args.slice(cmd.aR[a].tV[1] ? 2 : 1) };
                else
                    continue;
            const res = cmd.aR[a].tV[0].find((v) => args.slice(0, v.split(' ').length).join(' ') === v);
            if (res)
                return { aRN: a, tV: cmd.aR[a].tV[1] ? args.slice(0, cmd.aR[a].tV[2]) : args[0], nA: cmd.aR[a].tV[1] ? args.slice(cmd.aR[a].tV[2]) : args.slice(res.split(' ').length) };
        }
        const argTypes = {};
        nextArgs?.filter(a => !['sta', 'dyn'].includes(cmd.aR[a].tY))?.forEach(a => Object.assign(argTypes, { [cmd.aR[a].tY]: a }));
        const allTypes = Object.keys(argTypes);
        if (allTypes.includes('plr')) {
            if (args[0] === '@s' || args[0].toLowerCase() === player.name.toLowerCase())
                if (cmd.aR[argTypes['plr']].tV[0]?.self ?? true)
                    return { aRN: argTypes['plr'], tV: cmd.aR[argTypes['plr']].tV[1] ? player : Player.offlinePlayer(player.name), nA: args.slice(1) };
                else
                    return;
            const val = cmd.aR[argTypes['plr']].tV[1] ? Player.playerType(world.getAllPlayers().find(p => p.name.toLowerCase() === args[0].toLowerCase()), cmd.aR[argTypes['plr']].tV[0]) : Player.offlinePlayer(args[0]);
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
                else
                    // if(num.startsWith('^')) loc[i] = Number(num.replace('^', '')) + player.viewVector[i == 0 ? 'x' : i == 1 ? 'y' : 'z'] else //To be finished
                    loc[i] = Number(num);
                left = left.replace(`${num}`, '').trim();
            }
            if (loc.length === 3)
                return { aRN: argTypes['loc'], tV: { x: loc[0], y: loc[1], z: loc[2] }, nA: left.length ? left.split(' ') : [] };
        }
        if (allTypes.includes('num') && !isNaN(Number(args[0])) && (cmd.aR[argTypes['num']].tV?.float ? true : !`${Number(args[0])}`.includes('.')))
            return { aRN: argTypes['num'], tV: Number(args[0]), nA: args.slice(1) };
        if (allTypes.includes('tim')) {
            let time = 0, left = args[0], testing = true;
            while (testing) {
                const test = left?.match(timeRegex)?.[0];
                if (test) {
                    left = left.replace(test, '').trim();
                    time = time + MS(test);
                }
                else
                    testing = false;
            }
            const minMax = cmd.aR[argTypes['tim']].tV;
            if (left !== args[0] && (minMax?.min ?? 0) <= time && minMax?.max ? time <= minMax.max : true)
                return { aRN: argTypes['tim'], tV: time, nA: args.slice(1) };
        }
        if (allTypes.includes('ukn') && args.length) {
            const text = cmd.aR[argTypes['ukn']].tV[0] === 1 ? args[0] : args.slice(0, cmd.aR[argTypes['ukn']].tV[0]);
            if (cmd.aR[argTypes['ukn']].tV[1] && [].concat(text).join(' ').replace(/[\w!#$&*',.-_~§()[ \]]/g, '') !== '')
                return;
            return { aRN: argTypes['ukn'], tV: text, nA: args.slice(cmd.aR[argTypes['ukn']].tV[0]) };
        }
    }
    findExample(type, player) {
        if (!type)
            return;
        if (type.tY === 'sta')
            return staticBook[type.tV[0]].val[0];
        if (type.tY === 'dyn')
            return type.tV[0][0];
        if (type.tY === 'ukn')
            return ['bruh', 'ok', 'monkey', '"michael jackson"', 'idk', 'minecraft?'][~~(Math.random() * 6)];
        if (type.tY === 'plr')
            return world.getAllPlayers().find(p => p.name !== player.name)?.name || (type.tV[0]?.self ?? true) ? '@s' : undefined;
        if (type.tY === 'num')
            return `${type.tV ? ~~(Math.random() * (type.tV?.max || (type.tV?.min + 5) || 15)) + type.tV?.min || (type.tV?.max - 5) || -15 : ~~(Math.random() * 100)}`;
        if (type.tY === 'loc')
            return '~ ~ ~';
        if (type.tY === 'boo')
            return 'true';
        if (type.tY === 'tim')
            return MS(type.tV?.max > 0 ? type.tV.max : type.tV?.min ? type.tV.min : 3600000);
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
    run(cmd, player, args) {
        quick.logs.commandLogs.push([player?.name, player?.rID, cmd?.name, args]);
        if (!cmd)
            return player.error(lang.cmd.unknown(this.prefix, player.isAdmin), 'ROT');
        if (!cmd.rM.cM)
            return player.error(lang.cmd.useForm, 'ROT');
        if (player.isAdmin ? false : cmd.admin || (cmd.tags?.length ? !player.hasTags(cmd.tags) : false))
            return player.error(lang.cmd.noPerms, 'ROT');
        if (!cmd.sT[0].length && args.length)
            return player.error(lang.cmd.noArgs, 'ROT');
        if (cmd.sT[1] && !args.length)
            if (cmd.sT[0].some(a => cmd.aR[a].tY === 'plr' && (cmd.aR[a].tV[0]?.self ?? true)))
                args = ['@s'];
            else if (cmd.sT[0].some(a => cmd.aR[a].tY === 'loc'))
                args = ['~~~'];
            else
                return player.error(lang.cmd.missingArgs(this.prefix, cmd.name, args, this.findExample(cmd.aR[cmd.sT[0][0]], player)), 'ROT');
        const cls = {}, output = this.parseArgs(args);
        if (!output)
            return player.error(lang.cmd.openQou);
        let fetchCLs = true, tries = 0, nextArgs = output;
        while (fetchCLs) {
            if (!nextArgs.length)
                fetchCLs = false;
            if (!fetchCLs)
                continue;
            const nAR = !tries ? cmd.sT[0] : cmd.aR[Object.keys(cls).reverse()[0]]?.nA;
            if (!nAR?.length && nextArgs.length)
                return player.error(lang.cmd.maxArgs(nextArgs[0]), 'ROT');
            const type = this.findType(cmd, player, nAR, nextArgs), arg = type?.aRN ? cmd.aR[type.aRN] : null;
            if (!arg)
                return player.error(lang.cmd.notAArg(this.prefix, cmd.name, args.slice(0, args.length - nextArgs.length), nextArgs[0], nextArgs.slice(1).join(' '), this.findExample(cmd.aR[nAR[0]], player)), 'ROT');
            if (arg.nN && !type.nA.length)
                if (cmd.aR[type.aRN].nA.some(a => cmd.aR[a].tY === 'plr' && (cmd.aR[a].tV[0]?.self ?? true)))
                    Object.assign(type, { nA: ['@s'] });
                else if (cmd.aR[type.aRN].nA.some(a => cmd.aR[a].tY === 'loc'))
                    Object.assign(type, { nA: ['~~~'] });
                else
                    return player.error(lang.cmd.missingArgs(this.prefix, cmd.name, args, this.findExample(cmd.aR[arg.nA[0]], player)));
            if (['dyn', 'sta'].includes(arg.tY) && !type.tV?.length && arg.tV[1])
                return player.error(lang.cmd.needVal(this.prefix, arg.tV[0]), 'ROT');
            if (arg.tY === 'sta' && (!staticBook[arg.tV[0]]?.con(type.tV) ?? false))
                return player.error(staticBook[arg.tV[0]]?.err ?? lang.cmd.valErr(this.prefix, arg.tV[0]), cmd.name);
            if (arg.tG?.length && !arg.tG.some(t => player.hasTag(t)))
                return player.error(lang.cmd.noArgPerm, 'ROT');
            Object.assign(cls, { [type.aRN]: type.tV });
            nextArgs = type.nA;
            tries++;
        }
        try {
            const keys = Object.keys(cls), values = keys.map(k => cls[k]);
            if (cmd.cB) {
                let value = [values].flat(1);
                system.run(() => {
                    cmd.cB(player, value);
                    if (this.forceQueue.hasOwnProperty(player.name))
                        cmd.aR[this.forceQueue[player.name][1]].cB(player, this.forceQueue[player.name][2], []);
                });
            }
            values.splice(0, 1);
            for (let i = 0; i < keys.length; i++) {
                if (Object.keys(this.endQueue).includes(cmd.name))
                    return this.endQueue[cmd.name] && this.endQueue[cmd.name](player);
                let value = [values].flat(1);
                if (cmd.aR[keys[i]].cB)
                    system.run(() => {
                        cmd.aR[keys[i]].cB(player, cls[keys[i]], value);
                        if (this.forceQueue.hasOwnProperty(player.name) && cmd.aR[this.forceQueue[player.name][1]].cB)
                            system.run(() => cmd.aR[this.forceQueue[player.name][1]].cB(player, this.forceQueue[player.name][2], value));
                    });
                values.splice(0, 1);
            }
        }
        catch (e) {
            console.warn(`${e}:${e.stack}`);
            quick.logs.errors.push(`${e} : ${e.stack}`);
        }
        delete this.forceQueue[player.name];
        delete this.endQueue[cmd.name];
    }
    /**
     * Makes a command show up as a FormUI for a player
     * @param {string} cmd The name of the command
     * @param {newPlayer} player The player
     * @example .form(playerToPaper(data.sender, { from: warp }), 'warp');
     * @returns {void}
     */
    form(cmd, player) {
        if ((cmd.admin && !player.hasTag(quick.adminTag)) || (cmd.tags?.length && !cmd.tags.some(t => player.hasTag(t))))
            return player.error(lang.cmd.noPerms, 'ROT');
        const cL = {};
        let args = cmd.sT[0];
        async function trying() {
            const form = new ActionForm();
            form.setTitle(`§6§l${cmd.name}`);
            args.forEach(a => form.addButton(`§a${a}`));
            form.addButton('§4§lClose');
            console.warn('sent');
            await form.send(player);
        }
    }
    /**
     * Register a command into ROT
     * @param {command} cmd The command
     * @example .register(.create({ name: 'nothing' }));
     * @returns {void}
     */
    map(cmd) {
        return [''];
    }
}
const Commands = new CommandPaper(quick.prefix);
export default Commands;
/**
 * The command class
 */
class command {
    constructor(information, handle) {
        handle.list.push(Object.assign(information, {
            sT: [[], false],
            aR: {},
            cB: null,
            rM: { cM: true, fM: true, tG: true },
        }));
        this.handle = handle;
        this.name = information.name;
        this.index = this.handle.list.findIndex(c => c.name === this.name);
        quick.logs.commands.push(information.name);
    }
    /**
     * Runs a function if the command is execute successfully (Before the arg callbacks)
     * @param {ArrowFunction | Function} callback The function
     * @example .callback((player, args) => console.warn(`${player.ranks()} ${args.join(' ')}`));
     * @returns {command}
     */
    callback(callback) {
        this.handle.list[this.index].cB = callback;
        return this;
    }
    /**
     * This will escape/end the argument and command
     * @example .end();
     * @returns {void}
     */
    end(callback) {
        Object.assign(this.handle.endQueue, { [this.name]: callback });
    }
    /**
     * Force the command builder to run a argument. Remember, this argument will run after the origin has been called
     * @param argument The name of the argument
     * @param {string} value The value that will the command builder will send to the argument (recommended)
     */
    force(player, argument, value) {
        Object.assign(this.handle.forceQueue, { [player.name]: [this.name, argument, value] });
    }
    /**
     * The starting argument(s) for the command. This is required if you have arguments
     * @param {string | string[]} args The name of the argument(s)
     * @param {boolean} needArg If the command needs arguments or not
     * @example .startingArgs(['tpa send', 'tpa accept'], true);
     * @returns {command}
     */
    startingArgs(args, needArg) {
        let arg = [].concat(args), test = [];
        arg.forEach(a => !test.includes(a) && test.push(a));
        if (arg.length !== test.length)
            throw console.warn(`Please check your starting args for "${this.name}"!`);
        this.handle.list[this.index].sT = [arg, needArg ?? true];
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
        const rM = this.handle.list[this.index].rM;
        if (cmd !== undefined && rM.cM !== cmd)
            this.handle.list[this.index].rM.cM = cmd;
        if (form !== undefined && rM.fM !== form)
            this.handle.list[this.index].rM.fM = form;
        if (tag !== undefined && rM.tG !== tag)
            this.handle.list[this.index].rM.tG = tag;
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
        if (Object.keys(this.handle.list[this.index].aR).includes(name))
            throw console.warn(`Failed to add argument "${name}" to "${this.name}". This argument/type already exists!`);
        const nA = [].concat(nextArgs ?? []);
        Object.assign(this.handle.list[this.index].aR, { [name]: {
                tY: 'sta',
                tV: [type, needValue ?? true],
                cB: callback ?? null,
                nA: nA,
                nN: nA.length ? needNextArg ?? Boolean(nA?.length) : false
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
        if (Object.keys(this.handle.list[this.index].aR).includes(name))
            throw console.warn(`Failed to add argument "${name}" to "${this.name}". This argument/type already exists!`);
        const nA = [].concat(nextArgs ?? []);
        Object.assign(this.handle.list[this.index].aR, { [name]: {
                tY: 'boo',
                cB: callback ?? null,
                nA: nA,
                nN: nA.length ? needNextArg ?? Boolean(nA?.length) : false
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
        if (Object.keys(this.handle.list[this.index].aR).includes(name))
            throw console.warn(`Failed to add argument "${name}" to "${this.name}". This argument/type already exists!`);
        const nA = [].concat(nextArgs ?? []);
        Object.assign(this.handle.list[this.index].aR, { [name]: {
                tY: 'loc',
                tV: loaded ?? true,
                cB: callback ?? null,
                nA: nA,
                nN: nA.length ? needNextArg ?? Boolean(nA?.length) : false
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
        if (Object.keys(this.handle.list[this.index].aR).includes(name))
            throw console.warn(`Failed to add argument "${name}" to "${this.name}". This argument/type already exists!`);
        if (data && data.min > data.max)
            throw console.warn(`Argument "${name}" from command "${this.name}" cannot have a min value greater than the max.`);
        const nA = [].concat(nextArgs ?? []);
        Object.assign(this.handle.list[this.index].aR, { [name]: {
                tY: 'num',
                tV: data ?? null,
                cB: callback ?? null,
                nA: nA,
                nN: nA.length ? needNextArg ?? Boolean(nA?.length) : false
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
    playerType(name, callback, online, nextArgs, data, needNextArg) {
        if (Object.keys(this.handle.list[this.index].aR).includes(name))
            throw console.warn(`Failed to add argument "${name}" to "${this.name}". This argument/type already exists!`);
        const nA = [].concat(nextArgs ?? []);
        Object.assign(this.handle.list[this.index].aR, { [name]: {
                tY: 'plr',
                tV: [data ?? {}, online ?? true],
                cB: callback ?? null,
                nA: nA,
                nN: nA.length ? needNextArg ?? Boolean(nA?.length) : false
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
        if (Object.keys(this.handle.list[this.index].aR).includes(name))
            throw console.warn(`Failed to add argument "${name}" to "${this.name}". This argument/type already exists!`);
        const nA = [].concat(nextArgs ?? []);
        Object.assign(this.handle.list[this.index].aR, { [name]: {
                tY: 'tim',
                tV: data ?? null,
                cB: callback ?? null,
                nA: nA,
                nN: nA.length ? needNextArg ?? Boolean(nA?.length) : false
            } });
        return this;
    }
    /**
     * Creates a dynamic argument
     * @param {string} name The name of the argument
     * @param {string} value What the command builder is looking for
     * @param {ArrowFunction | Function} callback The function that runs after the argument is found
     * @param {string | string[]} nextArgs The name of the next argument(s) that will run afther this
     * @param {boolean} needValue If the arg after this one will be need and returned as a value
     * @param {number} length The number of args it will return as a value (Will not be processed if needValue is false or undefined)
     * @param {boolean} needNextArg If the next argument(s) from before are needed
     * @example .dynamicType('hello', 'BOI WHAT THE HELLLLL', (plr, str, args) => {
     * <tab> console.warn(string); //Output: 'BOI WHAT THE HELLLLL'
     * }, ['hi 2.0'], false);
     * @returns {command}
     */
    dynamicType(name, value, callback, nextArgs, needValue, length, needNextArg) {
        if (Object.keys(this.handle.list[this.index].aR).includes(name))
            throw console.warn(`Failed to add argument "${name}" to "${this.name}". This argument/type already exists!`);
        const val = [].concat(value);
        if (val.some(v => staticValues.includes(v)))
            throw console.warn(`Dynamic argument "${name}" from command "${this.name}" can't have a value that is already in a static type.`);
        const nA = [].concat(nextArgs ?? []);
        Object.assign(this.handle.list[this.index].aR, { [name]: {
                tY: 'dyn',
                tV: [val, needValue, length ?? 1],
                cB: callback ?? null,
                nA: nA,
                nN: nA.length ? needNextArg ?? Boolean(nA?.length) : false,
                tG: []
            } });
        return this;
    }
    /**
     * Creates a unknown argument
     * @param {string} name The name of the argument
     * @param {ArrowFunction | Function} callback The function that runs after the argument is found
     * @param {string | string[]} nextArgs The name of the next argument(s) that will run afther this
     * @param {number} length The number of args it will return as a value (Will not be processed if needValue is false or undefined)
     * @param {boolean} filter Check if the argument(s) have characters that aren't allowed
     * @param {boolean} needNextArg If the next argument(s) from before are needed
     * @example .unknownType('hello', (plr, str, args) => {
     * <tab> console.warn(string); //Output: Shiii, idk...
     * }, ['hi 2.0']);
     * @returns {command}
     */
    unknownType(name, callback, length, filter, nextArgs, needNextArg) {
        if (Object.keys(this.handle.list[this.index].aR).includes(name))
            throw console.warn(`Failed to add argument "${name}" to "${this.name}". This argument/type already exists!`);
        const nA = [].concat(nextArgs ?? []);
        Object.assign(this.handle.list[this.index].aR, { [name]: {
                tY: 'ukn',
                tV: [length ?? 256, filter ?? true],
                cB: callback ?? null,
                nA: nA,
                nN: nA.length ? needNextArg ?? Boolean(nA?.length) : false,
                tG: []
            } });
        return this;
    }
    bridge(name, value, argNames, callback, needArgs) {
        if (Object.keys(this.handle.list[this.index].aR).includes(name))
            throw console.warn(`Failed to add bridge "${name}" to "${this.name}". This argument/type already exists!`);
        const val = [].concat(argNames);
        Object.assign(this.handle.list[this.index].aR, { [name]: {
                tY: 'dyn',
                tV: [staticBook[value].val, false, 0],
                cB: callback ?? null,
                nA: val,
                nN: needArgs ?? true,
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
    config(argNames, info) {
        const args = [].concat(argNames);
        args.forEach(a => {
            const arg = this.handle.list[this.index].aR[a], tags = info.tags ? info.tags : arg?.tG ?? [];
            if (info.admin)
                tags.push(quick.adminTag);
            if (!arg)
                throw console.warn(`Failed editing argument "${a}" from command "${this.name}" because it does not exist!`);
            Object.assign(this.handle.list[this.index].aR[a], {
                nA: info.nextArgs ?? arg.nA,
                tG: tags,
                nN: info.needNextArgs ?? arg.nN
            });
        });
        return this;
    }
}
