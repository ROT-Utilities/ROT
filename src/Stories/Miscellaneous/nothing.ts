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
let nothing = [
    'Nothing',
    'Nothing?',
    'Nothing??',
    'Nothing???',
    'Nothing????',
    'Nothing?????',
    'Nothing??????',
    'Nothing???????',
    'Nothing????????',
    'Nothing?????????',
    'Nothing??????????',
    'Nothing???????????',
    'Nothing????????????',
    'Nothing?????????????',
    'Nothing??????????????',
    'Nothing???????????????',
    'Nothing????????????????',
    'Nothing?????????????????',
    'Nothing??????????????????',
    'Nothing???????????????????',
    'Nothing????????????????????',
    'Nothing!',
    'Nothing!!',
    'Nothing!!!',
    'nothing...',
    'Nothing!!!!!',
    'Nothing!!!!!!',
    'Nothing!!!!!!!',
    'Nothing!!!!!!!!',
    'Nothing!!!!!!!!!',
    'NoThInG',
    'nOtHiNg',
    'NOthINg',
    'noTHinG',
    'NOtHIng',
    'noThiNG',
    'Nothing?!?!?!??!'
];
Server.command.register({
    cancelMessage: true,
    name: 'nothing',
    description: `This command does ${nothing[~~(Math.random() * nothing.length)]}!`,
    aliases: ['nut', 'void', 'not'],
    category: 'Miscellaneous',
    documentation: {
        usage: 'nothing',
        information: 'This command will do absolutely NOTHING!',
        examples: [
            'nothing'
        ],
        developers: ['Mo9ses']
    }
}, chatmsg => Server.broadcast(`§4§l` + nothing[~~(Math.random() * nothing.length)], chatmsg.sender.name, nothing[~~(Math.random() * nothing.length)]));