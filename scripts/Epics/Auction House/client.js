import { metricNumbers } from '../../Papers/paragraphs/ConvertersParagraphs.js';
import { confirmForm } from '../../Papers/paragraphs/ExtrasParagraphs.js';
import { ActionForm, MessageForm } from '../../Papers/FormPaper.js';
import { newItem } from '../../Papers/paragraphs/itemParagraph.js';
import { serverPosts } from './server.js';
import { createPost } from './create.js';
import { openPost } from './open.js';
import { AH } from './main.js';
import Database from '../../Papers/DatabasePaper.js';
export async function clientPosts(player, from) {
    const allPosts = getPlayerKey(player, 'AHP', 'AHP');
    //Checks if there are any
    if (!allPosts.length)
        return await confirmForm(player, '§8§lCreate a new auction?§r', 'It doesn\'t look like you made any auctions yet... Would you like to make one?') ? createPost(player, clientPosts) : AH.openAH(player);
    //Creates the client auction screen
    const ah = new ActionForm();
    ah.setTitle('§8§lYour Auctions§r');
    ah.setBody('§7These are all your running auctions! Click on them to see more.§r');
    ah.addButton('§6§lCreate New Auction§r', 'textures/rot/forms/new.png');
    //Add a button for each client auction
    allPosts.forEach(p => {
        const post = AH.getPost(p);
        if (post)
            ah.addButton(`§c§l${post.name.length > 10 ? post.name.slice(0, 12) + '...' : post.name}\n§6${post.bids[0] ? `Highest Bid: §a$${metricNumbers(post.price)}` : 'No bids...'}§r`, `textures/rot/forms/random${~~(Math.random() * 8) + 1}.png`);
    });
    ah.addButton('§c§lView all Auctions§r', 'textures/rot/forms/global.png');
    ah.addButton('§c§lBack§r', 'textures/rot/forms/leave.png');
    ah.send(player, res => {
        if (res.canceled)
            return AH.openAH(player);
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
        return await confirmForm(player, '§c§lBroke?...§r', 'You have not bidded on a auction yet... Do you want to bid on one?') ? serverPosts(player, AH.openAH) : AH.openAH(player);
    //Creates the client auction screen
    const ah = new ActionForm();
    ah.setTitle('§8§lYour Auctions§r');
    ah.setBody('§7Here are all the active auctions you have bidded on. If you don\'t see a auction here, it might have been completed.§r');
    //Add a button for each client auction
    allBids.forEach(p => {
        const post = AH.getPost(p);
        if (post)
            ah.addButton(`§c§l${post.name.length > 10 ? post.name.slice(0, 12) + '...' : post.name}\n${post.bidID[0] === player.rID ? '§aWinning' : '§cLosing'}§r`, `textures/rot/forms/random${~~(Math.random() * 8) + 1}.png`);
    });
    ah.addButton('§c§lView all Auctions§r', 'textures/rot/forms/global.png');
    ah.addButton('§c§lBack§r', 'textures/rot/forms/leave.png');
    ah.send(player, res => {
        if (res.canceled)
            return AH.openAH(player);
        if (res.selection === allBids.length)
            return serverPosts(player, clientBids);
        if (res.selection === allBids.length + 1)
            return from(player, clientBids);
        if (res.selection < allBids.length)
            openPost(player, allBids[res.selection], clientBids);
    });
}
export async function clientCollect(player) {
    const collect = getPlayerKey(player, 'AHC', 'AHC'), sold = AH.AHS.read(player.rID) || [];
    if (!collect.length && !sold.length)
        return await confirmForm(player, '§c§lNothing?...§r', 'You do not have any items or money to collect. Would you like to create a auction?') ? createPost(player, serverPosts) : AH.openAH(player);
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
            return AH.openAH(player);
        //Collect money
        if (index >= collect.length) {
            index = res.selection - collect.length;
            const profit = new MessageForm();
            profit.setTitle('§a§lCongratulations!§r');
            profit.setBody(`§a§lNice!§r You made §c§l${metricNumbers(sold[index][1])} §6${AH.config.currency}§r from your §4§l${sold[index][0]}§r auction. Would you like to make another auction?`);
            profit.setButton1('§a§lSure!§r');
            profit.setButton2('§c§lNah...§r');
            return profit.send(player, res => {
                res.selection ? both === 1 ? AH.openAH(player) : clientCollect(player) : player.send('Come back soon!');
                player.runCommandAsync(`scoreboard players add @s "${AH.config.obj}" ${sold[index][1]}`);
                sold.splice(index, 1);
                AH.AHS.write(player.rID, sold);
            });
        }
        if (!Database.has(collect[index], 'AHC'))
            return AH.errorForm(player, clientCollect, 'Unable to find collect data');
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
                    return AH.openAH(player);
                if (!Database.has(collect[index], 'AHC'))
                    return AH.errorForm(player, clientCollect, 'Unable to find collect data');
                const success = new MessageForm();
                success.setTitle('§a§lDone!§r');
                success.setBody('The auction has been deleted along with the item!');
                success.setButton1('§a§lSee other auctions§r');
                success.setButton2('§4§lClose§r');
                if (res.selection) {
                    player.getComponent('inventory').container.addItem(newItem(Database.register(db.d, 'AHI').read('')));
                    success.setBody('The auction has been removed, and the item has been returned to your inventory.');
                }
                success.send(player, res => res.selection ? both === 1 ? serverPosts(player, AH.openAH) : clientCollect(player) : player.send('Come back soon!'));
                Database.drop(db.d, 'AHI');
                Database.drop(collect[index], 'AHC');
                collect.splice(index, 1);
                AH.AHC.write(player.rID, collect);
            });
        }
        //People bidded
        if (db?.w[0] !== player.rID)
            return AH.errorForm(player, clientCollect, 'Unable to verify you are the top bidder');
        let keepersKeep = ~~(db.w[1] / 100) * AH.config.buyersPremiumPercent[0];
        if (keepersKeep > AH.config.buyersPremiumPercent[1])
            keepersKeep = AH.config.buyersPremiumPercent[1];
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
                return AH.errorForm(player, clientCollect, 'Unable to find collect data');
            const done = new MessageForm();
            done.setTitle('§a§lAlrightly!§r');
            if (player.getScore(AH.config.obj) < keepersKeep)
                return player.send(`§c§lError §7-§r You don\'t have enough money to pay the Buyers premium. You owe me §c$${Math.abs(player.getScore(AH.config.obj) - keepersKeep)}§6 ${AH.config.obj}§r!`);
            player.runCommandAsync(`scoreboard players remove @s "${AH.config.obj}" ${keepersKeep}`);
            done.setBody('§l§6Wooo!§r Your item has been given to you!!!');
            player.getComponent('inventory').container.addItem(newItem(Database.register(db.d, 'AHI').read('')));
            Database.drop(db.d, 'AHI');
            Database.drop(collect[index], 'AHC');
            collect.splice(index, 1);
            AH.AHC.write(player.rID, collect);
            AH.AHS.write(db.c[0], [AH.AHS.read(db.c[0]) || [], [[db?.n ?? db.i, db.w[1]]]].flat());
            done.setButton1('§a§lOk!§r');
            done.setButton2('§c§lClose§r');
            done.send(player, res => res.selection ? both === 1 ? AH.openAH(player) : clientCollect(player) : player.send('Come back soon!'));
        });
    });
}
export function getPlayerKey(player, key, id) {
    if (!AH[key].has(player.rID))
        AH[key].write(player.rID, []);
    AH[key].forEach((p, i) => {
        if (Database.has(p, id))
            return;
        const posts = AH[key].read(player.rID);
        posts.splice(i, 1);
        AH[key].write(player.rID, posts);
    });
    return AH[key].read(player.rID);
}
//These are for the ping icon
export const bidPING = (player) => getPlayerKey(player, 'AHB', 'AHP')?.some((p) => AH.getPost(p)?.bidID[0] !== player.rID);
export const collectPING = (player) => Boolean(getPlayerKey(player, 'AHC', 'AHC').length || AH.AHS.read(player.rID)?.length);
