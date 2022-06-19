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
import Server from '../../ServerBook.js';
import config from '../../config.js';
/*
 * Welcome to the Fantasy category!
 * Main Developer: Mo9ses
 * Sub developer: NOBODY
 * Link to name: Fantasy
*/
Server.command.register({
    cancelMessage: true,
    name: 'fantasy',
    lister: true
}, chatmsg => {
    let commandsList = [];
    for(let testCommand of Server.command.get()) {
        if((Server.command.getRegistration(testCommand).category ? Server.command.getRegistration(testCommand).category.toLowerCase() : '') === 'fantasy') commandsList.push('§4§l' + testCommand + '§d - §5' + Server.command.getRegistration(testCommand).description);
    }
    Server.broadcast(`\nHere are all the §cFantasy§7 category:\n` + commandsList.join('\n'), chatmsg.sender.name, 'HELP', false);
    return Server.tBroadcast('Join the ROT Discord if you need any more help!§l§d ' + config.theDiscord, chatmsg.sender.name, 'ROT');
});