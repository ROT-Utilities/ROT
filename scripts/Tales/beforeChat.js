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
import { world } from '@minecraft/server';
import { listeners } from './main.js';
import quick from '../quick.js';
import Commands from '../Papers/CommandPaper/CommandPaper.js';
import Lang from '../Papers/LangPaper.js';
import Player from '../Papers/PlayerPaper.js';
/**
 * The rank system and the command starter/runner
 */
world.events.beforeChat.subscribe(data => {
    try {
        data.cancel = true;
        if (!data.message.startsWith(quick.prefix)) {
            const player = Player.playerType(data.sender, { from: 'CHAT' }), time = new Date();
            for (const event of listeners) {
                if (event[0] !== 'beforeChat')
                    continue;
                try {
                    event[1]({ message: data.message, player: player });
                }
                catch {
                    return data.cancel = true;
                }
            }
            ;
            if (data.message.startsWith(quick.prefix))
                return player.error(Lang.cmd.wrongPrefix(quick.prefix));
            if (data.sender.hasTag('mute'))
                return player.error(Lang.chat.mutted);
            if (data.message.trim() === '')
                return;
            if (!quick.chatRanks)
                return data.cancel = false;
            const message = data.message.charAt(0).toUpperCase() + data.message.slice(1), rank = `§7[${player.getPrefixes().join('§r§7, ')}§r§7] ${player.getNameColor()}`;
            return Array.from(world.getPlayers()).forEach(plr => {
                const tz = Player.getScore(plr, 'ROTTimezone'), hour = time.getUTCHours() + tz > 24 ? Math.abs(tz - time.getUTCHours()) : time.getUTCHours() + tz;
                plr.sendMessage(`${rank}§r§7 ${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:${time.getUTCMinutes() < 10 ? '0' + time.getUTCMinutes() : time.getUTCMinutes()} ${hour >= 12 ? 'pm' : 'am'}: §f${message}§r`);
            });
        }
        const args = data.message.slice(quick.prefix.length).trim().split(/\s+/), command = args.shift().toLowerCase(), cmd = Commands.list.find(cmd => cmd.name === command || cmd.aliases && cmd.aliases.includes(command));
        Commands.run(cmd, Player.playerType(data.sender, { from: cmd?.name ?? 'ROT' }), args);
    }
    catch (e) {
        console.warn(e + e.stack);
        return data.cancel = false;
    }
});
