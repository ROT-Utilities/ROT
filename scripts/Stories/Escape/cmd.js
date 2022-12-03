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
const cmd = Server.command.create({
    name: 'cmd',
    aliases: ['command', 'command-run', 'execute-command', 'exe'],
    description: 'This command will execute a normal Minecraft command for you',
    category: 'Escape',
    admin: true,
    developers: ['Mo9ses']
});
cmd.startingArgs('cmdName');
cmd.dynamicType('cmdName', '*', (plr, val) => {
    plr.send('The command has been executed on your player!');
    plr.runCommandAsync(val);
});
