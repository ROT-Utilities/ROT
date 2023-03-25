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
import { ActionForm } from "../../Papers/FormPaper.js";
import { metricNumbers } from "../../Papers/paragraphs/ConvertersParagraphs.js";
import { confirmForm } from "../../Papers/paragraphs/ExtrasParagraphs.js";
import { createPost } from "./create.js";
import { openPost } from "./open.js";
import Database from "../../Papers/DatabasePaper.js";
import { AH } from "./main.js";
//Exporting server form
export async function serverPosts(player, from) {
    //Get all auctions
    const allPosts = Database.allTables('AHP');
    if (!allPosts.length)
        return await confirmForm(player, '§8§lCreate a new auction?§r', 'Huh... There are no auctions going on right now. Do you want to make one?') ? createPost(player, AH.openAH) : AH.openAH(player);
    //Creates all auction screen
    const ah = new ActionForm();
    ah.setTitle('§8§lAll Auctions§r');
    ah.setBody('§7Nice! There looks like there\'s a couple auctions going on. Better start bidding!§r');
    //Add a button for each server auction
    allPosts.forEach(a => {
        const post = AH.getPost(a);
        if (post)
            ah.addButton(`§c§l${post.name.length > 10 ? post.name.slice(0, 12) + '...' : post.name}\n§6${post.bids[0] ? 'Highest Bid' : 'Starting price'}: §a$${metricNumbers(post.price)}§r`, `textures/rot/forms/random${~~(Math.random() * 8) + 1}.png`);
    });
    ah.addButton('§a§lRefresh§r', 'textures/rot/forms/refresh.png');
    ah.addButton('§c§lBack§r', 'textures/rot/forms/leave.png');
    ah.send(player, res => {
        if (res.canceled)
            return AH.openAH(player);
        if (res.selection === allPosts.length)
            return serverPosts(player, from);
        if (res.selection < allPosts.length)
            return openPost(player, allPosts[res.selection], serverPosts);
        if (res.selection === allPosts.length + 1)
            return from(player, AH.openAH);
    });
}
