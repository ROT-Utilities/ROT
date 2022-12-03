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
/**
import { world, Location } from '@minecraft/server';
import config from '../../config.js';
import quick from '../../Papers/DatabasePaper.js';
import { hexToText, textToHex } from '../../Papers/paragraphs/ConvertersParagraphs.js';
import Server from '../../ServerBook.js';
const cmd = Server.command.create({
    name: 'home',
    description: `You can use this commmand to create, teleport, and delete your home`,
    aliases: ['house'],
    category: 'Escape',
    developers: ['Aex66']
});
cmd.startingArgs(['create', 'delete', 'teleport', 'list'])

cmd.staticType('create', 'create', (plr, homeName) => {
    'Homes: [ { name, loc: { x, y, z }, dim, index } ]'
    const { x, y, z } = plr.location

    const tag = plr.getTags().find(tag => tag.startsWith('Homes:')) ?? null
    let homes: Array<{ name: string, loc: { x: number, y: number, z: number }, dim: string }> = tag ? JSON.parse(hexToText(tag.slice(6).trim())) : []
    if (homes.length + 1 > config.maxHomes)
        return plr.send(`§cYou can't create more than ${config.maxHomes} homes!`, 'HOME')

    if (homes.find(home => home.name === homeName))
        return plr.error('You already have a home with that name!', 'HOME')

    homes.push({ name: homeName, loc: { x: Math.trunc(x), y: Math.trunc(y), z: Math.trunc(z) }, dim: plr.dimension.id })
    if (tag)
        plr.removeTag(tag)
    plr.addTag('Homes:' + textToBinary(JSON.stringify(homes)))
    plr.send(`Your home has been set to §c${Math.trunc(x)}§7, §e${Math.trunc(y)}§7, §a${Math.trunc(z)}§7!`, 'HOME')
})

cmd.staticType('delete', 'remove', (plr, homeName) => {
    const tag = plr.getTags().find(tag => tag.startsWith('Homes:')) ?? null
    let homes: Array<{ name: string, loc: { x: number, y: number, z: number }, dim: string }> = tag ? JSON.parse(binaryToText(tag.slice(6).trim())) : []
    if (!homes.length)
        return plr.send(`You don't have homes to delete! You can make one by typing "§7${quick.prefix}home set§c" in chat.`, 'HOME')
    if (!homes.find(home => home.name === homeName))
        return plr.error(`You don't have a home with that name`, 'HOME')
    const index = homes.findIndex(home => home.name === homeName), home = homes.find(home => home.name === homeName)
    plr.send(`Your home §c${home.name}§7 at §c${home.loc.x}§7, §c${home.loc.y}§7, §c${home.loc.z}§7 has been §4§lDELETED§r§7!`, 'HOME')
    plr.removeTag(tag)
    homes.splice(index, 1)
    plr.addTag("Homes:" + textToBinary(JSON.stringify(homes)))
})

cmd.staticType('teleport', 'teleport', (plr, homeName) => {
    const tag = plr.getTags().find(tag => tag.startsWith("Homes:")) ?? null
    let homes: Array<{ name: string, loc: { x: number, y: number, z: number }, dim: string }> = tag ? JSON.parse(binaryToText(tag.slice(6).trim())) : []

    if (!homes.length)
        return plr.send(`You don't have homes to delete! You can make one by typing "§7${quick.prefix}home set§c" in chat.`, 'HOME')
    if (!homes.find(home => home.name === homeName))
        return plr.error(`You don't have a home with that name!`, 'HOME')
    
    const home = homes.find(home => home.name === homeName)
    const { x, y, z } = home.loc
    plr.send(`You have been teleported to your home §e${home.name}§r§7 at §c${x}§7, §a${y}§7, §e${z}§7!`, 'HOME')
    plr.teleport(new Location(x, y, z), world.getDimension(home.dim), plr.rotation.x, plr.rotation.y)
})

cmd.staticType('list', 'list', (plr) => {
    const tag = plr.getTags().find(tag => tag.startsWith("Homes:")) ?? null
    let homes: Array<{ name: string, loc: { x: number, y: number, z: number }, dim: string }> = tag ? JSON.parse(binaryToText(tag.slice(6).trim())) : []

    let msg = `§rYour homes:\n`
    homes.forEach(home => msg += `§r-${home.name}\n §r-Location: §c${home.loc.x} §a${home.loc.y} §e${home.loc.z}\n §r-Dimension: §7${home.dim.slice(10)}\n`)

    if (!homes.length)
        msg = `§cYou don't have homes!`
    plr.tell(msg)
}, null, false)
*/
//disabled for the moment
