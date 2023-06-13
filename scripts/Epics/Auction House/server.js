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
import { ActionForm } from "../../Papers/FormPaper.js";
import { metricNumbers } from "../../Papers/Paragraphs/ConvertersParagraphs.js";
import { confirmForm } from "../../Papers/Paragraphs/ExtrasParagraphs.js";
import { connected } from "../../Tales/playerConnect.js";
import { createPost } from "./create.js";
import { openPost } from "./open.js";
import { AH } from "./main.js";
import Database from "../../Papers/DatabasePaper.js";
//Exporting server form
export async function serverPosts(player, from) {
    if (AH.config.clientShop)
        return clientShop(player, from);
    //Get all auctions
    const allPosts = Database.allTables('AHP');
    if (!allPosts.length)
        return await confirmForm(player, '§8§lCreate a new auction?', 'Huh... There are no auctions going on right now. Do you want to make one?') ? createPost(player, AH.openAH) : AH.openAH(player);
    //Creates all auction screen
    const ah = new ActionForm();
    ah.setTitle('§8§lAll Auctions§r');
    ah.setBody('§7Nice! There looks like there\'s a couple auctions going on. Better start bidding!');
    //Add a button for each server auction
    for (const a of allPosts) {
        const post = await AH.getPost(a);
        if (post)
            ah.addButton(`§c§l${post.name.length > 10 ? post.name.slice(0, 12) + '...' : post.name}\n§6${post.bids[0] ? 'Highest Bid' : 'Starting price'}: §a$${metricNumbers(post.price)}§r`, `textures/ROT/forms/Auction House/random${~~(Math.random() * 8) + 1}.png`);
    }
    ah.addButton('§a§lRefresh§r', 'textures/ROT/forms/Auction House/refresh.png');
    ah.addButton('§c§lBack§r', 'textures/ROT/forms/Auction House/leave.png');
    ah.send(player, res => {
        if (res.canceled)
            return AH.openAH(player);
        if (res.selection === allPosts.length)
            return serverPosts(player, from);
        if (res.selection === allPosts.length + 1)
            return from(player, AH.openAH);
        if (res.selection < allPosts.length)
            openPost(player, allPosts[res.selection], serverPosts);
    });
}
async function clientShop(player, from) {
    //Getting all connected IDs with thier player names
    const IDnames = {};
    for (const c in connected)
        IDnames[connected[c].rID] = [c, []];
    //Getting all posts and filtering them
    const allPosts = [];
    for (const p of Database.allTables('AHP')) {
        const post = await AH.getPost(p);
        if (!IDnames.hasOwnProperty(post.creator.id))
            continue;
        allPosts.push(post);
    }
    for (const post of allPosts)
        IDnames[(await post).creator.id][1].push(await post);
    for (const id in IDnames)
        if (!IDnames[id][1].length)
            delete IDnames[id];
    //If no connected auctions
    if (!allPosts.length)
        return await confirmForm(player, '§8§lCreate a new auction?', 'Nobody in the server has a auction up right now. Would you like to make one?') ? createPost(player, AH.openAH) : AH.openAH(player);
    //Creates all auction screen
    const IDArray = Object.entries(IDnames), ah = new ActionForm();
    ah.setTitle('§6§lPlayer auctions§r');
    ah.setBody('§7Here are all the online players that are running auctions.');
    IDArray.forEach(seller => ah.addButton(`§l§a${seller[1][0]}\n§c${seller[1][1].length} auctions`));
    ah.addButton('§a§lRefresh§r', 'textures/ROT/forms/Auction House/refresh.png');
    ah.addButton('§c§lBack§r', 'textures/ROT/forms/Auction House/leave.png');
    ah.send(player, res => {
        if (res.canceled)
            return AH.openAH(player);
        if (res.selection === IDArray.length)
            return serverPosts(player, from);
        if (res.selection === IDArray.length + 1)
            return from(player, AH.openAH);
        const seller = IDArray[res.selection][1], posts = new ActionForm();
        posts.setTitle(`§c§l${seller[0]}'s§a auction`);
        posts.setBody(`§7Here are all of the auctions that §c${seller[0]}§7 is running.`);
        seller[1].forEach(post => {
            posts.addButton(`§c§l${post.name.length > 10 ? post.name.slice(0, 12) + '...' : post.name}\n§6${post.bids[0] ? 'Highest Bid' : 'Starting price'}: §a$${metricNumbers(post.price)}§r`, `textures/ROT/forms/Auction House/random${~~(Math.random() * 8) + 1}.png`);
        });
        posts.addButton('§c§lBack§r', 'textures/ROT/forms/Auction House/leave.png');
        posts.send(player, res => {
            if (res.canceled)
                return AH.openAH(player);
            if (res.selection === seller[1].length)
                return clientShop(player, from);
            openPost(player, seller[1][res.selection].date, serverPosts);
        });
    });
}
