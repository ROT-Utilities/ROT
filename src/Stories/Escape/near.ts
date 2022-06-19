import Server from '../../ServerBook.js' //weren't you going to put the gen? xd
import config from '../../config.js'
import { EntityQueryOptions } from "mojang-minecraft"

Server.command.register({
    cancelMessage: true,
    name: 'near',
    description: 'Get the closest player to your position',
    aliases: ['closest'],
    category: 'Escape',
    documentation: {
        usage: 'near',
        examples: [
            'near',
            'closest'
        ],
        developers: ['Aex']
    }
},
(chatmsg, args) => {
    const opts = new EntityQueryOptions()
    opts.closest = 2
    opts.location = chatmsg.sender.location
    opts.minDistance = 2
    opts.maxDistance = 60

    const player = [...chatmsg.sender.dimension.getPlayers(opts)][0]
    if (!player) return Server.broadcast('§cThere is no player close enough to your location', chatmsg.sender.name, 'NEAR')
    Server.broadcast(`§7The nearest player §c${~~((chatmsg.sender.location.x + chatmsg.sender.location.y + chatmsg.sender.location.z) - (player.location.x + player.location.y + player.location.z))} §7blocks away your location is: §e${player?.name}`, chatmsg.sender.name, 'NEAR')
})

Server.command.register({
    cancelMessage: true,
    name: 'nearT',
    description: `Toggles ${Server.lang.prefix}near so members can use ${Server.lang.prefix}near how you set it to!`,
    aliases: ['near-toggle', 'near-t'],
    category: 'Escape',
    admin: true,
    documentation: {
        usage: 'neart',
        examples: [
            'neart',
            'near-toggle'
        ],
        developers: ['Aex']
    }
}, chatmsg => Server.basicCommandToggle('near', chatmsg.sender.name));