//Don't forget to make ROT support multiple languages
//Finish !nick
//Add name colors back
//Add !link
//Add TPS
//Add a command that will let you make commands


/**
 * Add clear lag
 * Command runner
 * Make a custom command maker and let them use theeir own prefix
 * Player info command
 * Ban item
 * Daily rewards
 * Repair item
 * Economy system
 * Add games
 * Add kits
 * Private vaults?
 * Announcement
 * World edit and factions
 * Add redeem system
 */

//Idle Miner
//Counters
//Roll out! Work for money and try stealing it from others. You can also bet on things
//Make a game like poki-mon to colect anime girls - I didn't suggest this
//Make GG nice
//Virtual Fisher
//Make an AI
//Add tycoon games
//Add UNO
//Add NFTs
//Add chess

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

// if((new DatabasePaper('SS').get(objective + 'LB')?.lastUpdated ?? 0) < new Date().getTime()) {
//     new DatabasePaper('SS').set(objective + 'LB', {
//         lastUpdated: new Date().getTime() + 30000,
//         objective: objective,
//         data: leaderboardString
//     });
// }
// Server.command.register({
//     cancelMessage: true,
//     name: 'payout',
//     description: 'Shows the richest in the server!',
//     aliases: ['po', 'lastpay', 'list', 'payout'],
//     category: 'Miscellaneous',
//     documentation: {
//         usage: 'po <objective>',
//         examples: [
//             'po Money',
//             'po Wins'
//         ],
//         developers: ['Mo9ses']
//     }
// }, (chatmsg, args) => {
//     if(!args[0]) return Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'Payout');
//     if(!Server.settings.has(args.join(' ') + 'LB')) return Server.eBroadcast(Server.lang.error2, chatmsg.sender.name, 'Payout');
//     const lb = Server.settings.get(args.join(' ') + 'LB');
//     Server.broadcast(`Displaying the §a${lb.objective.charAt(0).toUpperCase() + lb.objective.slice(1).trim()} §fLeaderboard§7!\n${lb.data}`, chatmsg.sender.name, 'Payouts');
// });

// function buyItem(player, buy_item, buy_count, buy_data, buy_cost, buy_objective = "money") {
//     if(getScore(player, buy_objective) < buy_count * buy_cost) return { complete: false, error: "Not enough money" };
//     let inventory_object = [];
//     let inventory1 = player.getComponent('minecraft:inventory').container;
//     for(let i = 0; i < inventory1.size; i++) {
//         let item1 = inventory1.getItem(i);
//         if(!item1) item1 = 0;
//         inventory_object.push({
//             slot: i, data: item1
//         });
//     }
//     let item_check = inventory_object.filter((it) => {
//         if(it['data'].id === buy_item && it['data'].amount < 64 && it['data'].data === buy_data) return true;
//         else return false;
//     })?.map((it) => it = { slot: it['slot'], amount: it['data'].amount }),
//         empty_slot = inventory_object.filter((it) => it['data'] = 0),
//         counter1 = 64 * inventory1.emptySlotsCount;
//     if(item_check) for(let do_item_check of item_check) counter1 += 64 - do_item_check['amount'];
//     if(buy_count > counter1) return { complete: false, error: "Not enough slot to buy" };
//     console.warn(counter1, `give "${player.nameTag}" ${buy_item} ${buy_count} ${buy_data}`);
//     runCommands([
//         `give "${player.nameTag}" ${buy_item} ${buy_count} ${buy_data}`,
//         `scoreboard players remove "${player.nameTag}" ${buy_objective} ${buy_count * buy_cost}`
//     ]);
//     return { complete: true, error: "" };
// }

import Server from '../../ServerBook.js';
Server.command.register({
    cancelMessage: true,
    name: 'hi',
    description: 'Say hi to ROT!',
    aliases: ['wassup', 'hello!'],
    category: 'Miscellaneous',
    documentation: {
        usage: 'hi',
        information: 'This command will do absolutely NOTHING!',
        notes: 'Join the Discord server here: https://discord.com/invite/2ADBWfcC6S',
        examples: [
            'hi'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    Server.broadcast(`Hello §c${args ? args.join(' ') : chatmsg.sender.name}§7!`, chatmsg.sender.name, 'Hi');
});