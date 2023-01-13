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
import { startup } from '../../main.js';
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import Lang from '../../Papers/LangPaper.js';
import Database from '../../Papers/DatabasePaper.js';
import Server from '../../Papers/ServerPaper.js';
const cmd = Commands.create({
    name: 'setup',
    description: 'This command will setup ROT. You can only run this command once',
    category: 'ROT',
    admin: true,
    developers: ['Mo9ses']
});
cmd.relayMethod({ tag: false, form: false });
cmd.callback(plr => {
    if (Database.register('server').read('setup'))
        return plr.error('ROT is already setup!');
    Server.runCommands([
        'gamerule sendcommandfeedback false',
        'gamerule commandblockoutput false'
    ]);
    startup();
    plr.send(Lang.setup.setup, 'Setup', false);
});
