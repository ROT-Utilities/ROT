import Commands from "../Papers/CommandPaper/CommandPaper.js";
const cmd = Commands.create({
    name: 'test',
    description: 'Let\'s you test a ROT command by having a AI run random operations',
    aliases: ['t-'],
    category: 'Dev',
    admin: true
});
cmd.startingArgs('hi');
cmd.unknownType('any');
cmd.dynamicType('hi', 'hi', (p, _, args) => {
}, 'any');
