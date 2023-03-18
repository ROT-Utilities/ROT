import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import Database from '../../Papers/DatabasePaper.js';
const db = Database.register('warps');
const cmd = Commands.create({
    name: 'warp',
    description: 'Use this command to set, remove, and teleport to all the warps you want',
    aliases: ['w', 'wrp'],
    category: 'Escape',
    developers: ['Mo9ses']
});
cmd.startingArgs(['set', 'list', 'remove', 'tp']);
cmd.unknownType('any', null, 1);
cmd.staticType('set', 'set', (plr, val, args) => {
    if (db.allKeys().length > 50)
        plr.send('This server has over 50 warps. Having too many warps can cause lag', '§6Warning§r');
    db.write(val, [args[0].x, args[0].y, args[0].z, args[1] ? args : '']);
    plr.send(`Successfully created a warp at §a${args[0].x}§e, §a${args[0].y}§e, §a${args[0].z}§e${args[1] ? ` with the tag ${args[1]}` : ''}.§r`);
}, 'loc');
cmd.locationType('loc', null, 'any', false, false);
cmd.staticType('list', 'list', (plr, val, args) => {
});
cmd.staticType('remove', 'remove', (plr, val, args) => {
});
cmd.unknownType('tp', (plr, val) => {
});
cmd.config(['set', 'remove'], { admin: true });
