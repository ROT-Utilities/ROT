import { metricNumbers } from '../../Papers/paragraphs/ConvertersParagraphs.js';
import { ActionForm, MessageForm } from '../../Papers/FormPaper.js';
import { newItem } from '../../Papers/paragraphs/itemParagraph.js';
import { confirmForm, errorForm, getPost, openAH } from './main.js';
import { serverPosts } from './server.js';
import { createPost } from './create.js';
import { openPost } from './open.js';
import quick from "../../quick.js";
import Database from '../../Papers/DatabasePaper.js';
//Config?
const config = quick.epics['Auction House'];
export async function clientPosts(player, from) {
    const allPosts = getPlayerKey(player, 'AHP', 'AHP');
    //Checks if there are any
    if (!allPosts.length)
        return await confirmForm(player, '§8§lCreate a new auction?§r', 'It doesn\'t look like you made any auctions yet... Would you like to make one?') ? createPost(player, clientPosts) : openAH(player);
    //Creates the client auction screen
    const ah = new ActionForm();
    ah.setTitle('§8§lYour Auctions§r');
    ah.setBody('§7These are all your running auctions! Click on them to see more.§r');
    ah.addButton('§6§lCreate New Auction§r', 'textures/rot/forms/new.png');
    //Add a button for each client auction
    allPosts.forEach(p => {
        const post = getPost(p);
        if (post)
            ah.addButton(`§c§l${post.name.length > 10 ? post.name.slice(0, 12) + '...' : post.name}\n§6${post.bids[0] ? `Highest Bid: §a$${metricNumbers(post.price)}` : 'No bids...'}§r`, `textures/rot/forms/random${~~(Math.random() * 8) + 1}.png`);
    });
    ah.addButton('§c§lView all Auctions§r', 'textures/rot/forms/global.png');
    ah.addButton('§c§lBack§r', 'textures/rot/forms/leave.png');
    ah.send(player, res => {
        if (res.canceled)
            return openAH(player);
        if (res.selection === 0)
            return createPost(player, clientPosts);
        if (res.selection === allPosts.length + 1)
            return serverPosts(player, clientPosts);
        if (res.selection === allPosts.length + 2)
            return from(player, clientPosts);
        if (res.selection <= allPosts.length)
            openPost(player, allPosts[res.selection - 1], clientPosts);
    });
}
//Exporting function that shows all of the auctions the player has bidded on
export async function clientBids(player, from) {
    const allBids = getPlayerKey(player, 'AHB', 'AHP');
    //Checks if there are any
    if (!allBids.length)
        return await confirmForm(player, '§c§lBroke?...§r', 'You have not bidded on a auction yet... Do you want to bid on one?') ? serverPosts(player, openAH) : openAH(player);
    //Creates the client auction screen
    const ah = new ActionForm();
    ah.setTitle('§8§lYour Auctions§r');
    ah.setBody('§7Here are all the active auctions you have bidded on. If you don\'t see a auction here, it might have been completed.§r');
    //Add a button for each client auction
    allBids.forEach(p => {
        const post = getPost(p);
        if (post)
            ah.addButton(`§c§l${post.name.length > 10 ? post.name.slice(0, 12) + '...' : post.name}\n${post.bidID[0] === player.rID ? '§aWinning' : '§cLosing'}§r`, `textures/rot/forms/random${~~(Math.random() * 8) + 1}.png`);
    });
    ah.addButton('§c§lView all Auctions§r', 'textures/rot/forms/global.png');
    ah.addButton('§c§lBack§r', 'textures/rot/forms/leave.png');
    ah.send(player, res => {
        if (res.canceled)
            return openAH(player);
        if (res.selection === allBids.length)
            return serverPosts(player, clientBids);
        if (res.selection === allBids.length + 1)
            return from(player, clientBids);
        if (res.selection < allBids.length)
            openPost(player, allBids[res.selection], clientBids);
    });
}
export async function clientCollect(player) {
    if (!player.has('AHS'))
        player.write('AHS', []);
    const collect = getPlayerKey(player, 'AHC', 'AHC'), sold = player.read('AHS');
    if (!collect.length && !sold.length)
        return await confirmForm(player, '§c§lNothing?...§r', 'You do not have any items or money to collect. Would you like to create a auction?') ? createPost(player, serverPosts) : openAH(player);
    const form = new ActionForm();
    form.setTitle('§8§lCollect items§r');
    form.setBody('§aHere are all of the auctions you won and made a profit from.§r');
    collect?.forEach(c => {
        const values = Database.register(c, 'AHC').readMany(['n', 'i', 'w']), won = values[2]?.[0] === player.rID;
        form.addButton(`§c§l${values[0] ?? values[1]}\n§6${won ? 'Collect items' : '§4Failed Auction!'}§r`, `textures/rot/forms/${won ? 'collect' : 'fail'}.png`);
    });
    sold?.forEach(s => form.addButton(`§c§l${s[0]}\n§6Collect $${metricNumbers(s[1])}§r`, `textures/rot/forms/coins.png`));
    form.addButton('§a§lRefresh§r', 'textures/rot/forms/refresh.png');
    form.addButton('§c§lBack§r', 'textures/rot/forms/leave.png');
    form.send(player, res => {
        let index = res.selection;
        const both = sold.length + collect.length;
        if (res.selection === both)
            return clientCollect(player);
        if (res.canceled || res.selection === both + 1)
            return openAH(player);
        //Collect money
        if (index >= collect.length) {
            index = res.selection - collect.length;
            const profit = new MessageForm();
            profit.setTitle('§a§lCongratulations!§r');
            profit.setBody(`§a§lNice!§r You made §c§l${metricNumbers(sold[index][1])} §6${config.currency}§r from your §4§l${sold[index][0]}§r auction. Would you like to make another auction?`);
            profit.setButton1('§a§lSure!§r');
            profit.setButton2('§c§lNah...§r');
            return profit.send(player, res => {
                res.selection ? both === 1 ? openAH(player) : clientCollect(player) : player.send('Come back soon!');
                player.runCommandAsync(`scoreboard players add @s "${config.obj}" ${sold[index][1]}`);
                sold.splice(index, 1);
                player.write('AHS', sold);
            });
        }
        if (!Database.has(collect[index], 'AHC'))
            return errorForm(player, clientCollect, 'Unable to find collect data');
        const db = Database.register(collect[index], 'AHC').getCollection();
        //No people bidded
        if (!db?.w?.length) {
            const failed = new MessageForm();
            failed.setTitle('§4§lFailed Auction§r');
            failed.setBody(`Tuff... Seems like nobody wanted to pay a penny for your item "§c§l${db?.n ?? db.i}§r". Do you want it back?`);
            failed.setButton1('§aSure!§r');
            failed.setButton2('§cNah, you keep it§r');
            return failed.send(player, res => {
                if (res.canceled)
                    return openAH(player);
                if (!Database.has(collect[index], 'AHC'))
                    return errorForm(player, clientCollect, 'Unable to find collect data');
                const success = new MessageForm();
                success.setTitle('§a§lDone!§r');
                success.setBody('The auction has been deleted along with the item!');
                success.setButton1('§a§lSee other auctions§r');
                success.setButton2('§4§lClose§r');
                if (res.selection) {
                    player.getComponent('inventory').container.addItem(newItem(Database.register(db.d, 'AHI').read('')));
                    success.setBody('The auction has been removed, and the item has been returned to your inventory.');
                }
                success.send(player, res => res.selection ? both === 1 ? serverPosts(player, openAH) : clientCollect(player) : player.send('Come back soon!'));
                Database.drop(db.d, 'AHI');
                Database.drop(collect[index], 'AHC');
                collect.splice(index, 1);
                player.write('AHC', collect);
            });
        }
        //People bidded
        if (db?.w[0] !== player.rID)
            return errorForm(player, clientCollect, 'Unable to verify you are the top bidder');
        let keepersKeep = ~~(db.w[1] / 100) * config.buyersPremiumPercent[0];
        if (keepersKeep > config.buyersPremiumPercent[1])
            keepersKeep = config.buyersPremiumPercent[1];
        const agree = new MessageForm();
        agree.setTitle('§a§lYou won a auction!§r');
        agree.setBody([
            '§a§lAuction information:§r',
            ` §3Auction name: §4${db?.n ?? db.i}`,
            ` §3Item: §4${db.i}`,
            ` §3Amount: §4${db.a}`,
            ` §3Starting bid: §c${metricNumbers(db.p)}`,
            ` §3Price: §c${metricNumbers(db.w[1])}`,
            ` §3Sercet auction: §c${db.c[2] ? true : false}`,
            ` §3Buyers premium: §c${keepersKeep}`
        ].join('\n'));
        agree.setButton1('§2§lLet\'s goo!!§r');
        agree.setButton2('§4§lClose...§r');
        agree.send(player, res => {
            if (res.canceled || !res.selection)
                return clientCollect(player);
            if (!Database.has(collect[index], 'AHC'))
                return errorForm(player, clientCollect, 'Unable to find collect data');
            const done = new MessageForm();
            done.setTitle('§a§lAlrightly!§r');
            if (player.getScore(config.obj) < keepersKeep)
                return player.send(`§c§lError §7-§r You don\'t have enough money to pay the Buyers premium. You owe me §c$${Math.abs(player.getScore(config.obj) - keepersKeep)}§6 ${config}§r!`);
            player.runCommandAsync(`scoreboard players remove @s "${config.obj}" ${keepersKeep}`);
            done.setBody('§l§6Wooo!§r Your item has been given to you!!!');
            player.getComponent('inventory').container.addItem(newItem(Database.register(db.d, 'AHI').read('')));
            Database.drop(db.d, 'AHI');
            Database.drop(collect[index], 'AHC');
            collect.splice(index, 1);
            player.write('AHC', collect);
            const createrDB = Database.register(db.c[0], 'PLR');
            createrDB.write('AHS', [createrDB.has('AHS') ? createrDB.read('AHS') : [], [[db?.n ?? db.i, db.w[1]]]].flat());
            done.setButton1('§a§lOk!§r');
            done.setButton2('§c§lClose§r');
            done.send(player, res => res.selection ? both === 1 ? openAH(player) : clientCollect(player) : player.send('Come back soon!'));
        });
    });
}
export function getPlayerKey(player, key, id) {
    if (!player.has(key))
        player.write(key, []);
    player.read(key).forEach((p, i) => {
        if (Database.has(p, id))
            return;
        const posts = player.read(key);
        posts.splice(i, 1);
        player.write(key, posts);
    });
    return player.read(key);
}
//These are for the ping icon
export function bidPING(player) {
    return getPlayerKey(player, 'AHB', 'AHP')?.some((p) => getPost(p)?.bidID[0] !== player.rID);
}
export function collectPING(player) {
    return Boolean(getPlayerKey(player, 'AHC', 'AHC').length || player.read('AHS')?.length);
}
