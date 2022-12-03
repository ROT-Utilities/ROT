import config from '../../config.js';
import Server from '../../ServerBook.js';
const cmd = Server.command.create({
    name: 'tagclear',
    description: 'Clears all of the tags off of a player. (expect the admin tag if they have it)',
    aliases: ['tc', 'tagc', 'tclear', 'tac'],
    category: 'Management',
    admin: true,
    developers: ['Aex66']
});
cmd.startingArgs('name', false);
cmd.callback((plr, args) => !args.length && plr.getTags().forEach(tag => tag !== config.adminTag ? plr.removeTag(tag) : false));
cmd.playerType('name', (_, plr) => plr.getTags().forEach(tag => tag !== config.adminTag ? plr.removeTag(tag) : false));
