import Server from '../../ServerBook.js'
import config from '../../config.js'
import { world } from "mojang-minecraft"

config.sudo && Server.command.register({
    cancelMessage: true,
    name: 'sudo',
    description: 'Fake kill and leave|join messages',
    aliases: ['sd'],
    category: 'Escape',
    documentation: {
        usage: 'sudo <death|join|leave> <target?: player>',
        information: 'Use this command to send fake death, join or leave messages',
        examples: [
            'sudo leave Mo9ses',
            'sudo join Aex66',
            'sudo death Aex66'
        ],
        developers: ['Aex']
    }
},
(chatmsg, args) => {
    const death = ['death', 'kill', 'killed', 'slain'], join = ['join', 'enter', 'login'], leave = ['leave', 'exit', 'left']

    if (death.includes(args[0])) {
        return world.getDimension('overworld').runCommand(`tellraw @a {"rawtext":[{"text":"${args[1] ? args[1] : chatmsg.sender.name} ${DeathMsgs[~~(Math.random() * DeathMsgs.length)]}"}]}`)
    }

    if (join.includes(args[0])) {
        return world.getDimension('overworld').runCommand(`tellraw @a {"rawtext":[{"text":"§e${args[1] ? args[1] : chatmsg.sender.name} joined the game"}]}`)
    }

    if (leave.includes(args[0])) {
        return world.getDimension('overworld').runCommand(`tellraw @a {"rawtext":[{"text":"§e${args[1] ? args[1] : chatmsg.sender.name} left the game"}]}`)
    }
})

const DeathMsgs = [
    'tried to swim in lava',
    'went up in flames',
    'discovered floor was lava',
    'drowned',
    'fell out of the world',
    'fell from a high place',
    'was slain by warden',
    'was obliterated by a sonically-charged shriek whilst trying to escape Warden',
    'was slain by Zombie',
    'burned to death',
    'was spined by shulker',
    'withered away',
    'was pricked to death',
    'hit the ground too hard',
    'experienced kinetic energy',
    'blew up',
    'was impaled on a stalagmite',
    'was squashed by a falling block',
    'was skewered by a falling stalactite',
    'was struck by lightning',
    'was killed by magic',
    'froze to death',
    'starved to death',
    'suffocated in a wall',
    'was poked to death by a sweet berry bush',
    'died'
]