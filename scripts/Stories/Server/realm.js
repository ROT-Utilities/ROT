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
Server.command.register({
    cancelMessage: true,
    name: 'realm',
    description: 'This command is also §6SUPER§5 useful!',
    aliases: ['rc', 'real', 'realmcode', 'realmc'],
    category: 'ROT',
    documentation: {
        usage: 'realm <code?>',
        information: 'This command will advertise the Realm Code!',
        examples: [
            'realm'
        ],
        developers: ['Mo9ses']
    }
}, (chatmsg, args) => {
    if (args[0] && chatmsg.sender.hasTag(config.adminTag))
        return Server.settings.set('realmCode', args.join(' ')), Server.broadcast(`§cThe realm code is now: §d` + Server.settings.get('realmCode'), chatmsg.sender.name, 'ROT');
    Server.broadcast(`§cHere's the code! §d` + Server.settings.get('realmCode'), chatmsg.sender.name, 'ROT');
});
