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
import { world } from "@minecraft/server";
import { ActionForm, ModalForm } from "../../Papers/FormPaper.js";
import { hexToNumber, metricNumbers, MS } from "../../Papers/paragraphs/ConvertersParagraphs.js";
import { confirmForm, errorForm, getPost, openAH, updatePost, verifyPost } from "./main.js";
import { editPost } from "./edit.js";
import { checkPosts } from "./interval.js";
import Server from '../../Papers/ServerPaper.js';
import Player from '../../Papers/PlayerPaper.js';
import Database from '../../Papers/DatabasePaper.js';
import quick from "../../main.js";
//Defining very much needed variables
const config = quick.epics['Auction House'];
//Opening the post XD
export function openPost(player, date, from) {
    if (hexToNumber(date) - new Date().getTime() <= 0)
        checkPosts();
    //Checks if post now exists
    const post = getPost(date);
    if (!post)
        return errorForm(player, from);
    //Calculating price?
    let keepersKeep = ~~(post.price / 100) * config.buyersPremiumPercent[0];
    if (keepersKeep > config.buyersPremiumPercent[1])
        keepersKeep = config.buyersPremiumPercent[1];
    //Setting the post up
    const view = new ActionForm();
    view.setTitle(`§l§1${post.name.length > 10 ? post.name.slice(0, 10) + '...' : post.name}§8 Auction§r`);
    view.setBody([
        '§a§lAuction information:§r',
        config.namePost ? `\n §3Auction name: §c${post.name}` : '',
        `\n §3Item: §4${post.itemName}`,
        `\n §3Enchants: §e${post.enchants.length ? post.enchants.map(e => `${e[0]}: §a${e[1]}`).join('§3, §e') : '§4none'}`,
        `\n §3Amount: §4${post.amount}`,
        `${post.bids[0] ? `\n §3Highest bid: §4${metricNumbers(post.price)}` : ''}`,
        `\n §3Starting price: §c${metricNumbers(post.startPrice)}`,
        `\n §3Bidders (High to low): §4${post.bidName.length ? post.bidName.map((n, i) => post.bidID[i] === player.id ? '§l§6YOU§r' : post.bidSilent[i] ? `${player.isAdmin ? `${post.creator.nameTag} ` : ''}§c(Hidden)` : n).join('§3, §c') : '§aNobody!'}`,
        `\n §3Buyers premium: §c${keepersKeep}`,
        `\n §3By: §c${post.creator.id === player.id ? '§l§6YOU§r' : post.creator.silent ? `${player.isAdmin ? `${post.creator.nameTag} ` : ''}§c(Hidden)` : post.creator.nameTag}`,
        `\n §3Ends in: §4${MS(hexToNumber(date) - new Date().getTime())}`,
        '\n§rWant the item? Place a bid below!'
    ].join(''));
    if (post.bidID[0] === player.id)
        view.addButton('§4§lRemove bid§r', 'textures/rot/forms/garbage.png');
    else if (post.creator.id === player.id)
        view.addButton('§9§lEdit Auction§r', 'textures/rot/forms/change.png');
    else
        view.addButton('§6§lBid!§r', 'textures/rot/forms/bid.png');
    view.addButton('§c§lBack§r', 'textures/rot/forms/leave.png');
    if (player.isAdmin && post.creator.id !== player.id)
        view.addButton('§4§lDev menu§r', 'textures/rot/forms/dev.png');
    view.send(player, async (res) => {
        if (res.selection === 1)
            return from(player, openAH);
        if (res.canceled)
            return openAH(player);
        if (res.selection === 2)
            return editPost(player, date, from);
        if (post.creator.id === player.id)
            return editPost(player, date, from);
        const price = post.price + 1;
        //Remove bid code
        if (post.bidID[0] === player.id) {
            if (post.removedIDs.includes(player.id) || (post.bidID[1] && !world.getAllPlayers().some(p => p.id === post.bidID[1])))
                return await confirmForm(player, '§4§lCannot remove§r', '§cRemember, you can only remove a bid from a auction once, and only if the last bidder is online.§r', '§eOk ;(§r', '§l§4Close§r') ? openPost(player, date, from) : player.send('Come back soon!');
            if (await confirmForm(player, '§c§lRemove bid?§r', `Are you sure you want to remove your bid from §c${post.name}§r? This may be the §4§llast chance§r you get to win this item.\n\nYou can only remove your bid §4§lONCE§r and if the last bidder is §a§lonline§r.`, '§a§lOpps! Wrong button...§r', '§c§lYeah, I need the money...§r'))
                return openPost(player, date, from);
            if (!verifyPost(date, post))
                return errorForm(player, from);
            const lastBidder = Player.getByID(post.bidID[1]);
            if (lastBidder) {
                lastBidder.send(`§c${post.bidSilent[0] ? '§cHidden' : player.nameTag}§e just removed their bid on the auction "§l§6${post.name}§r§e" and you are now the top bidder!§r`);
                Server.queueCommand(`scoreboard players remove "${lastBidder.nameTag}" "${config.obj}" ${post.bids[1]}`);
            }
            //Deletes player from post
            updatePost(date, { bidData: removeBid(date, post, player), removedIDs: [post.removedIDs, player.id].flat() });
            return openPost(player, date, from);
        }
        //Add bid screen
        if (player.getScore(config.obj) < price)
            return await confirmForm(player, '§4§lInsufficient funds§r', `You don't even enough money to bid on this item! You need atleast §c${Math.abs(player.getScore(config.obj) - price)}§r more §6${config.currency}§r!`, '§eOk ;(§r', '§l§4Close§r') ? openPost(player, date, from) : player.send('Come back soon!');
        //Creating bidding form
        const bid = new ModalForm();
        bid.setTitle(`§l§8Bid on §c${post.name.length > 10 ? post.name.slice(0, 10) + '...' : post.name}§r`);
        if (config.boxNumber)
            bid.addInput('Bid amount', `§6${price}-${player.getScore(config.obj)}§r`, price.toString());
        else
            bid.addSlider('Bid amount', price, player.getScore(config.obj), config.sliderStep, price);
        bid.addToggle('Silent Bidder (hide name)', false);
        bid.send(player, async (res) => {
            if (res.canceled)
                return openPost(player, date, from);
            if (hexToNumber(date) - new Date().getTime() <= 0)
                checkPosts();
            const post = getPost(date), sent = Number(res.formValues[0]), silent = res.formValues[1];
            if (!post)
                return errorForm(player, from);
            //Checks if the money they inputted is a number
            if (res.formValues[0].replace(/\d/g, '') !== '' || isNaN(sent))
                return await confirmForm(player, '§5Not a number§r', `"§5${res.formValues[0]}§r" is not a number. Would you like to try again?`) ? openPost(player, date, from) : from(player, openAH);
            //Check if they have the moeny and if it's vaild
            if (sent < price || sent > player.getScore(config.obj))
                return await confirmForm(player, '§5Size matters?§r', `"§5${res.formValues[0]}§r" is either too small or too big! Choose a number between §6${price}-${player.getScore(config.obj)}`) ? openPost(player, date, from) : from(player, openAH);
            //Confirming and updating the post
            if (!(await confirmForm(player, `§a§lYou sure?§r`, `Are you sure you want to bid §a$${metricNumbers(sent)} §6${config.currency}§r on §c§l${post.name}§r?`)))
                return openPost(player, date, from);
            if (!verifyPost(date, post))
                return errorForm(player, from);
            await updatePost(date, { bidData: addBid(date, post, player, sent, silent) });
            openPost(player, date, from);
        });
    });
}
;
function addBid(date, post, player, sent, silent) {
    const lastBidder = Player.getByID(post.bidID[0], { from: config.npcName });
    Server.queueCommand(`scoreboard players remove "${player.nameTag}" "${config.obj}" ${sent}`);
    if (lastBidder) {
        lastBidder.send(`§c${silent ? '§c(Hidden)' : player.nameTag}§e just outbidded you on the auction §l§6${post.name}§r§e!§r`);
        Server.queueCommand(`scoreboard players add "${lastBidder.nameTag}" "${config.obj}" ${post.bids[0]}`);
    }
    else if (post.bidID[0]) {
        const oldBid = Database.register(post.bidID[0], 'PLR');
        oldBid.write('AHR', (oldBid.read('AHR') || 0) + post.bids[0]);
    }
    if (!player.read('AHB')?.includes(date))
        player.write('AHB', [player.has('AHB') ? player.read('AHB') : [], date].flat());
    delete post.bidData[player.id];
    return Object.assign(post.bidData, { [player.id]: [player.nameTag, sent, silent ? 1 : 0] });
}
;
function removeBid(date, post, player) {
    const clientBids = player.read('AHB');
    Server.queueCommand(`scoreboard players add "${player.nameTag}" "${config.obj}" ${post.bids[0]}`);
    clientBids.splice(clientBids.indexOf(date), 1);
    player.write('AHB', clientBids);
    delete post.bidData[player.id];
    return post.bidData;
}
;
