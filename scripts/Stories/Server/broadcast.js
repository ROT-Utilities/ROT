import Server from '../../ServerBook.js';
const cmd = Server.command.create({
    name: 'broadcast',
    description: 'Broadcast a message to the entire server',
    aliases: ['b', 'bc', 'cast', 'console', 'bbcnews'],
    admin: true,
    category: 'Server',
    developers: ['Aex66']
});
cmd.startingArgs('msg');
cmd.dynamicType('msg', '*', (plr, msg) => Server.broadcast(msg.join(' ')), '', false, 256);
