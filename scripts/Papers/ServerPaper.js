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
Website: https://www.rotmc.ml
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Thank you!
*/
import { world } from '@minecraft/server';
import Player from './PlayerPaper.js';
import { setTickInterval } from './paragraphs/ExtrasParagraphs.js';
/*
 * ROT's command queue system
*/
const commandQueue = [];
setTickInterval(() => {
    if (!commandQueue.length)
        return;
    const hundred = commandQueue.slice(0, 100);
    commandQueue.splice(0, 100);
    for (let i = 0; i < 100; i++) {
        if (!hundred[i])
            return;
        world.getDimension(hundred[i][1] ?? 'overworld').runCommandAsync(hundred[i][0]).catch();
    }
}, 5);
/*
 * Welcome to the Server Paper!
 * Main Developer: notbeer
 * Notes: Broadcast is WAY better now
 * Sub developer: Mo9ses
 * Link to name: Server Paper
*/
class ServerPaper {
    /**
     * Broadcast a message to everyone in game
     * @param {string} message Message you want to broadcast in chat
     * @param {string} use The name of the use?
     * @returns {void} Nothing
     * @example .broadcast('Hello World!', 'Computer');
     */
    broadcast(message, use, sound, tag) {
        const players = Array.from(world.getPlayers(), p => Player.playerType(p));
        if (tag)
            return players.forEach(p => p.hasTag(tag) && p.send(message, use, sound));
        players.forEach(p => p.send(message, use, sound));
    }
    /**
    * Push commands to the command queue
    * @param command The command you want to run
    * @param dimension The dimension you want the command run
    * @returns {void} Nothing
    * @example .queueCommand('say Hello World!');
    */
    queueCommand(command, dimension) {
        commandQueue.push(dimension ? [command, dimension] : [command]);
    }
    /**
    * Run a asynchronous command in game that will run at runtime
    * @param command The command you want to run
    * @param dimension The dimension you want the command run
    * @returns {string} command had error
    * @example .runAsyncCMD('say Hello World!');
    */
    async runCommand(command, dimension) {
        let value = '';
        await world.getDimension(dimension ?? 'overworld').runCommandAsync(command).catch(e => value = e);
        return value;
    }
    /**
    * Run an array of commands
    * @param {Array<string>} commands Put '%' before your commands. It will make it so it only executes if all the commands thta came before it executed successfully!
    * @returns {{error: boolean }}
    * @example .runCommands([
    *   'clear "notbeer" diamond 0 0',
    *   '%say notbeer has a Diamond!'
    * ]);
    */
    runCommands(commands, queue) {
        if (queue)
            return commands.forEach(c => commandQueue.push([c]));
        const conditionalRegex = /^%/;
        if (conditionalRegex.test(commands[0]))
            throw 'Error >>: runCommands(): Error - First command in the Array CANNOT be Conditional';
        let e = false;
        commands.forEach(async (cmd) => {
            if (e && conditionalRegex.test(cmd))
                return;
            e = Boolean(await this.runCommand(cmd.replace(conditionalRegex, '')));
        });
        return { error: e };
    }
}
const Server = new ServerPaper();
export default Server;
