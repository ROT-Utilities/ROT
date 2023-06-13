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
import { ActionForm, ModalForm } from "../../Papers/FormPaper.js";
import { hexToNumber, metricNumbers, MS } from "../../Papers/Paragraphs/ConvertersParagraphs.js";
import { confirmForm } from "../../Papers/Paragraphs/ExtrasParagraphs.js";
import { checkPosts } from "./interval.js";
import { editPost } from "./edit.js";
import { AH } from "./main.js";
import Player from '../../Papers/PlayerPaper.js';
import quick from "../../quick.js";
//Defining very much needed variables
const config = quick.epics['Auction House'];
//Opening the post XD
export async function openPost(player, date, from) {
    if (hexToNumber(date) - new Date().getTime() <= 0)
        checkPosts();
    //Checks if post now exists
    const post = await AH.getPost(date);
    if (!post)
        return AH.errorForm(player, from);
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
        `\n §3Bidders (High to low): §4${post.bidName.length ? post.bidName.map((n, i) => post.bidID[i] === player.rID ? '§l§6YOU§r' : post.bidSilent[i] ? `${player.isAdmin ? `${post.creator.name} ` : ''}§c(Hidden)` : n).join('§3, §c') : '§aNobody!'}`,
        `\n §3Buyers premium: §c${keepersKeep}`,
        `\n §3By: §c${post.creator.id === player.rID ? '§l§6YOU§r' : post.creator.silent ? `${player.isAdmin ? `${post.creator.name} ` : ''}§c(Hidden)` : post.creator.name}`,
        `\n §3Ends in: §4${MS(hexToNumber(date) - new Date().getTime())}`,
        '\n§rWant the item? Place a bid below!'
    ].join(''));
    if (post.bidID[0] === player.rID)
        view.addButton('§4§lRemove bid§r', 'textures/ROT/forms/Auction House/garbage.png');
    else if (post.creator.id === player.rID)
        view.addButton('§9§lEdit Auction§r', 'textures/ROT/forms/Auction House/change.png');
    else
        view.addButton('§6§lBid!§r', 'textures/ROT/forms/Auction House/bid.png');
    view.addButton('§c§lBack§r', 'textures/ROT/forms/Auction House/leave.png');
    if (player.isAdmin && post.creator.id !== player.rID)
        view.addButton('§4§lDev menu§r', 'textures/ROT/forms/Auction House/dev.png');
    view.send(player, async (res) => {
        if (res.selection === 1)
            return from(player, AH.openAH);
        if (res.canceled)
            return AH.openAH(player);
        if (res.selection === 2)
            return editPost(player, date, from);
        if (post.creator.id === player.rID)
            return editPost(player, date, from);
        const price = post.price + 1;
        //Remove bid code
        if (post.bidID[0] === player.rID) {
            if (post.removedIDs.includes(player.rID) || (post.bidID[1] && !Player.getBy({ id: post.bidID[1] })))
                return await confirmForm(player, '§4§lCannot remove§r', '§cRemember, you can only remove a bid from a auction once, and only if the last bidder is online.§r', '§eOk ;(§r', '§l§4Close§r') ? openPost(player, date, from) : player.send('Come back soon!');
            if (await confirmForm(player, '§c§lRemove bid?§r', `Are you sure you want to remove your bid from §c${post.name}§r? This may be the §4§llast chance§r you get to win this item.\n\nYou can only remove your bid §4§lONCE§r and if the last bidder is §a§lonline§r.`, '§a§lOpps! Wrong button...§r', '§c§lYeah, I need the money...§r'))
                return openPost(player, date, from);
            if (!AH.verifyPost(date, post))
                return AH.errorForm(player, from);
            const lastBidder = Player.getBy({ id: post.bidID[1] });
            if (lastBidder) {
                lastBidder.send(`§c${post.bidSilent[0] ? '§cHidden' : player.name}§e just removed their bid on the auction "§l§6${post.name}§r§e" and you are now the top bidder!§r`);
                lastBidder.runCommandAsync(`scoreboard players remove @s "${config.obj}" ${post.bids[1]}`);
            }
            //Deletes player from post
            AH.updatePost(date, { bidData: removeBid(date, post, player), removedIDs: post.removedIDs.concat(player.rID) });
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
            const post = await AH.getPost(date), sent = Number(res.formValues[0]), silent = res.formValues[1];
            if (!post)
                return AH.errorForm(player, from);
            //Checks if the money they inputted is a number
            if (res.formValues[0].replace(/\d/g, '') !== '' || isNaN(sent))
                return await confirmForm(player, '§5Not a number§r', `"§5${res.formValues[0]}§r" is not a number. Would you like to try again?`) ? openPost(player, date, from) : from(player, AH.openAH);
            //Check if they have the moeny and if it's vaild
            if (sent < price || sent > player.getScore(config.obj))
                return await confirmForm(player, '§5Size matters?§r', `"§5${res.formValues[0]}§r" is either too small or too big! Choose a number between §6${price}-${player.getScore(config.obj)}`) ? openPost(player, date, from) : from(player, AH.openAH);
            //Confirming and updating the post
            if (!(await confirmForm(player, `§a§lYou sure?§r`, `Are you sure you want to bid §a$${metricNumbers(sent)} §6${config.currency}§r on §c§l${post.name}§r?`)))
                return openPost(player, date, from);
            if (!AH.verifyPost(date, post))
                return AH.errorForm(player, from);
            await AH.updatePost(date, { bidData: addBid(date, post, player, sent, silent) });
            openPost(player, date, from);
        });
    });
}
;
function addBid(date, post, player, sent, silent) {
    const lastBidder = Player.getBy({ id: post.bidID[0] }, { from: config.npcName });
    player.runCommandAsync(`scoreboard players remove @s "${config.obj}" ${sent}`);
    if (lastBidder) {
        lastBidder.send(`§c${silent ? '§c(Hidden)' : player.name}§e just outbidded you on the auction §l§6${post.name}§r§e!§r`);
        lastBidder.runCommandAsync(`scoreboard players add @s "${config.obj}" ${post.bids[0]}`);
    }
    else if (post.bidID[0])
        AH.client.AHR.write(post.bidID[0], (AH.client.AHR.read(post.bidID[0]) || 0) + post.bids[0]);
    AH.client.update(player.rID, 'AHB', 'add', date);
    delete post.bidData[player.rID];
    return Object.assign(post.bidData, { [player.rID]: [player.name, sent, silent ? 1 : 0] });
}
function removeBid(date, post, player) {
    player.runCommandAsync(`scoreboard players add @s "${config.obj}" ${post.bids[0]}`);
    AH.client.update(player.rID, 'AHB', 'remove', date);
    delete post.bidData[player.rID];
    return post.bidData;
}
