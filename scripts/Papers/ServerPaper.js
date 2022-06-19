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
import { world } from 'mojang-minecraft';
import config from '../config.js';
export class ServerPaper {
    /**
     * Broadcast a message in chat
     * @param {string} text Message you want to broadcast in chat
     * @param {string} player Player you want to broadcast to
     * @param {string} use What command is the player using
     * @param {boolean} console
     * @returns {runCommandReturn}
     * @example .broadcast('Hello World!', 'Mo9ses', 'Computer', false);
     */
    broadcast(text, player, use, console) {
        if (!use || use == '')
            use = '';
        else
            use = use.toUpperCase() + ' ';
        if (console === false)
            use = '';
        else
            use = `§l§4${use}§7${config.hiveArrow ? '§l' : '>>'}§r§7 `;
        if (player)
            if (player.startsWith('@'))
                null;
            else if (player.startsWith('"'))
                null;
            else
                player = `"${player}"`;
        else
            player = '@a';
        return this.runCommands([
            `execute ${console ? player : ''} ~~~ playsound random.toast @s ~~~ 1 0.5`,
            `execute ${player} ~~~ tellraw @s {"rawtext":[{"text":"${use}"},{"text":${JSON.stringify(text)}}]}`
        ]);
    }
    /**
     * Broadcast a tip in chat to suggest something the player should do
     * @param {string} text The "tip" you want to broadcast in chat
     * @param {string} player Player you want to a error broadcast to
     * @param {string} use What command is the player using
     * @returns {runCommandReturn}
     * @example .tBroadcast('Use ROT... Your players will thank you!', 'Mo9ses', 'ROT');
     */
    tBroadcast(text, player, use) {
        if (!use)
            use = '';
        else
            use = use.toUpperCase() + ' ';
        return this.runCommands([
            `execute ${player ? `"${player}"` : '@a'} ~~~ playsound random.toast @s ~~~ 1 0.5`,
            `execute ${player ? `"${player}"` : '@a'} ~~~ tellraw @s {"rawtext":[{"text":"§l§c${use}§aTIP §e${config.hiveArrow ? '§l' : '>>'}§r§e "},{"text":${JSON.stringify(text)}}]}`
        ]);
    }
    /**
     * Broadcast a ERROR message in chat
     * @param {string} text The error message you want to broadcast in chat
     * @param {string} player Player you want to a error broadcast to
     * @param {string} use What command is the player using
     * @returns {runCommandReturn}
     * @example .eBroadcast('Task failed!', 'Mo9ses', 'Task name');
     */
    eBroadcast(text, player, use) {
        if (!use)
            use = '';
        else
            use = use.toUpperCase() + ' ';
        return this.runCommands([
            `execute ${player ? `"${player}"` : '@a'} ~~~ playsound random.glass @s ~~~ 1 0.5`,
            `execute ${player ? `"${player}"` : '@a'} ~~~ tellraw @s {"rawtext":[{"text":"§l§c${use}§4Error §c${config.hiveArrow ? '§l' : '>>'}§r§c "},{"text":${JSON.stringify(text)}}]}`
        ]);
    }
    /**
    * Run a command in game
    * @param command The command you want to run
    * @param dimension The dimension you want the command run
    * @returns {runCommandReturn}
    * @example .runCommand('say Hello World!');
    */
    runCommand(command, dimension) {
        try {
            return { error: false, ...world.getDimension(dimension ?? 'overworld').runCommand(command) };
        }
        catch (error) {
            return { error: true };
        }
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
    runCommands(commands) {
        const conditionalRegex = /^%/;
        if (conditionalRegex.test(commands[0]))
            throw '§l§c>>§r§4: runCommands(): Error - First command in the Array CANNOT be Conditional';
        let error = false;
        commands.forEach(cmd => {
            if (error && conditionalRegex.test(cmd))
                return;
            error = this.runCommand(cmd.replace(conditionalRegex, '')).error;
        });
        return { error: error };
    }
}
