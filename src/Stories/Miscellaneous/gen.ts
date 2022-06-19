import Server from "../../ServerBook"
import { Items } from "mojang-minecraft"
import { MS } from "../../Papers/paragraphs/ConvertersParagraphs"

const timeFormatRegex = /^\d+\.?\d*\s?((years*?|yrs*?)|(weeks*?)|(days*?)|(hours*?|hrs*?)|(minutes*?|mins*?)|(seconds*?|secs*?)|[smhdwy])(?!\S)(?=\s?)/g

Server.command.register({
    name: 'gen',
    description: 'Create or remove a generator!',
    cancelMessage: true,
    aliases: ["generator"],
    admin: true,
    category: 'Miscellaneous',
    documentation: {
        developers: ['iBlqzed'],
        examples: ['gen create diamondgen', 'gen set diamondgen minecraft:diamond 1 0 25 seconds', 'gen toggle diamondgen', 'gen remove diamondgen']
    }
}, (data, args) => {
    if (!args[0]) return Server.eBroadcast('Missing argument. Valid arguements: create, remove, set, toggle', data.sender.name, 'GEN')
    if (args[0].toLowerCase() == 'create') {
        if (!args[1]) return Server.eBroadcast('You need to name the generator!', data.sender.name, 'GEN')
        if (args[2]) return Server.eBroadcast('Generator name must be 1 word', data.sender.name, 'GEN')
        if (Server.gens.has(args[1].toLowerCase())) return Server.eBroadcast(`You already have a generator named '${args[1]}'`, data.sender.name, 'GEN')
        Server.gens.set(args[1].toLowerCase(), {
            name: args[1].toLowerCase(),
            dimension: data.sender.dimension.id,
            x: data.sender.location.x.toFixed(2),
            y: data.sender.location.y.toFixed(2),
            z: data.sender.location.z.toFixed(2)
        }, true)
        Server.broadcast(`Generator ${args[1]} has been created!`, data.sender.name)
        return
    }
    if (args[0].toLowerCase() == 'set') {
        if (!args[1]) return Server.eBroadcast('You need to specify a generator name', data.sender.name, 'GEN')
        if (!Server.gens.has(args[1].toLowerCase())) return Server.eBroadcast(`${args[1]} is not a valid generator name!`, data.sender.name, 'GEN')
        if (!args[2]) return Server.eBroadcast('You need to specify an item', data.sender.name, 'GEN')
        if (!Items.get(args[2].toLowerCase())) return Server.eBroadcast('Invalid item', data.sender.name, 'GEN')
        if (!args[3]) return Server.eBroadcast('You need to specify an amount', data.sender.name, 'GEN')
        if (!args[3].match(/^\d+$/)) return Server.eBroadcast(`Not a valid amount`, data.sender.name, 'GEN')
        if (!args[4]) return Server.eBroadcast('You need to specify a data number', data.sender.name, 'GEN')
        if (!args[4].match(/^\d+$/)) return Server.eBroadcast(`Not a valid data number`, data.sender.name, 'GEN')
        if (!args[5]) return Server.eBroadcast('You need to specify a duration', data.sender.name, 'GEN')
        try {
            Server.gens.set(args[1].toLowerCase(), Object.assign(Server.gens.get(args[1].toLowerCase()), {
                item: args[2].toLowerCase(),
                amount: parseInt(args[3]),
                data: parseInt(args[4]),
                ticks: (MS(args.slice(5).join('').match(timeFormatRegex)[0]) / 50).toFixed(0),
                currentTick: (MS(args.slice(5).join('').match(timeFormatRegex)[0]) / 50).toFixed(0)
            }), true)
            Server.broadcast(`Generator ${args[1]} now makes ${args[3]} ${args[2]}${parseInt(args[3]) > 1 ? 's' : ''} (with data of ${args[4]}) every ${args.slice(5).join(' ')}`)
            return
        } catch {return Server.eBroadcast('Invalid time', data.sender.name, 'GEN')}
    }
    if (args[0].toLowerCase() == 'toggle') {
        if (!args[1]) return Server.eBroadcast('You need to specify a generator name', data.sender.name, 'GEN')
        if (!Server.gens.has(args[1].toLowerCase())) return Server.eBroadcast(`${args[1]} is not a valid generator name!`, data.sender.name, 'GEN')
        Server.gens.set(args[1].toLowerCase(), Object.assign(Server.gens.get(args[1].toLowerCase()), {
            toggle: Server.gens.get(args[1].toLowerCase()).toggle ? false : true
        }), true)
        Server.broadcast(`${args[1]} has been toggled ${Server.gens.get(args[1].toLowerCase()).toggle ? 'on' : 'off'}`)
        return
    }
    if (args[0].toLowerCase() == 'remove') {
        if (!Server.gens.has(args[1].toLowerCase())) return Server.eBroadcast(`${args[1]} is not a valid generator name!`, data.sender.name, 'GEN')
        Server.gens.delete(args[1].toLowerCase())
        Server.broadcast(`Generator ${args[1]} has been deleted!`, data.sender.name)
        return
    }
    Server.eBroadcast(`Invalid argument. Valid arguements: create, remove, set, toggle`, data.sender.name, 'GEN')
})