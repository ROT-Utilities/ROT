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
© Copyright 2022 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Website: https://www.rotmc.ml
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Thank you!
*/
import Server from '../../ServerBook.js';
const cmd = Server.command.create({
    name: 'clearchat',
    description: 'This command will clear the chat.',
    aliases: ['chatc', 'bomb', 'clearc'],
    admin: true,
    category: 'Server',
    developers: ['Aex66']
});
cmd.callback((plr) => {
    Server.broadcast('\n\n\n\n\n'.repeat(100));
    Server.broadcast(`The chat has been cleared by §c${plr.nameTag}§r§1!`, 'ROT');
});
