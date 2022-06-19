import Server from "../../ServerBook"
import { Items } from "mojang-minecraft"
import { MS } from "../../Papers/paragraphs/ConvertersParagraphs"

const timeFormatRegex = /^\d+\.?\d*\s?((years*?|yrs*?)|(weeks*?)|(days*?)|(hours*?|hrs*?)|(minutes*?|mins*?)|(seconds*?|secs*?)|[smhdwy])(?!\S)(?=\s?)/g

Server.command.register({
    name: 'generator',
    description: 'Create a item generator',
    cancelMessage: true,
    aliases: ['gen'],
    admin: true,
    category: 'Escape',
    documentation: {
        usage: 'gen <create|remove> <name: string> <block: string> <item: string> <amount: int> <data: int> <time>',,
        developers: ['Aex66'],
        examples: [
            'gen create diamondgen minecraft:diamond_block minecraft:diamond 1 0 1 min'
        ]
    }
}, (data, args) => {
    //args[0] = create | remove, args[1] = name, args[2] = block, args[3] = item, args[4] = amount, args[5] = data, args[6] = time
    const create = ['create', 'add', 'set'], remove = ['delete', 'remove', 'del', 'remv']

    if (create.includes(args[0])) {
        
    }
})
