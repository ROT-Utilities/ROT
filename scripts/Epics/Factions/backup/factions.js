import { confirmAction, sleep } from "../../../Papers/paragraphs/ExtrasParagraphs.js";
import { Claim } from "../chunk/claim.js";
import Database from "../../../Papers/DatabasePaper.js";
import Player from "../../../Papers/PlayerPaper.js";
import quick from "../../../quick.js";
class FactionBuilder {
    /**
     * join your faction
     * @param {PlayerType} player Player who will join the faction
     * @param {PlayerType} sender Player whose faction will be taken for the other player to join
     * @returns
     */
    join(player, name, sender) {
        let value = false;
        if (!has({ name: name }))
            return (Player.error(player, `There is no faction with the name §6${name}`),
                false);
        const faction = this.find(name);
        Player.send(sender, `§6${player.name} §ehas joined your faction!`, 'FTN');
        Player.send(player, `You have succesfully joined §6${name}'s §efaction`, 'FTN');
        value = true;
        Player.write(player, 'Faction', name);
        faction?.write('members', [this.getMembers(name), { name: player.name, id: player.id, role: 'member', joinDate: new Date().toLocaleDateString() }].flat());
        return value;
    }
    /**
     * @remarks kick a player out of a faction
     * @param {PlayerType} player Player who will be expelled from the faction
     * @param sender Player who will expel the target
     * @returns {boolean}
     */
    kick(player, sender) {
        const roles = {
            'owner': 4,
            'co-owner': 3,
            'admin': 2,
            'member': 1
        };
        const name = this.getFaction(sender);
        if (!has({ name: name }))
            return false;
        if (!Faction.inFaction(sender)) {
            Player.error(sender, 'You are in any factinos', 'FTN');
            return false;
        }
        //Check if target player isn't in faction
        if (!Faction.inFaction(player))
            return (Player.error(sender, `§6${player.name}§e is not member of any faction`, 'FTN'),
                false);
        //Check if sender and player are in the same faction
        if (this.getFaction(sender) !== this.getFaction(player))
            return (Player.error(sender, 'This player does not belong to your faction!', 'FTN'),
                false);
        //Check if the role of the sender is superior to the role of the target
        if (!(roles[this.getMemberRole(sender)] > roles[this.getMemberRole(player)]))
            return (Player.error(sender, 'You cannot kick this player', 'FTN'),
                false);
        const faction = this.find(name), members = this.getMembers(name), index = members.findIndex(member => member.id === player.id || member.name === player.name);
        members.splice(index, 1);
        Player.send(sender, `You have successfully kicked §6${player.name} §efrom your faction`, 'FTN');
        Player.send(player, `§6${sender.name}§e has kicked you out of their faction!`, 'FTN');
        Player.delete(player, 'Faction');
        faction?.write('members', members);
        return true;
    }
    /**
     * @remarks leave a faction
     * @param {PlayerType} player Player who will leave the faction
     * @returns {Promise<boolean>}
     */
    async leave(player) {
        if (!Player.read(player, 'FTN'))
            return (Player.error(player, 'You are not member of any faction', 'FTN'),
                true);
        const name = this.getFaction(player);
        if (!has({ name: name }))
            return false;
        if (this.getOwnerId(name) === player.id || this.getOwnerName(name) === player.name) {
            Player.send(player, 'Close the chat to open §6CONFIRM ACTION!§r', 'FTN');
            await sleep(40);
            confirmAction(player, 'Since you are the owner of this faction, if you leave you will have to delete the faction. Are you sure you want to delete your faction?', 'FTN', () => this.deleteFaction(player), () => Player.send(player, 'Ok!', 'FTN'));
            return false;
        }
        const faction = this.find(name);
        const members = this.getMembers(name);
        const index = members.findIndex(member => member.id === player.id || member.name === player.name);
        members.splice(index, 1);
        Player.send(player, `You have successfully exited §6${name}'s §efaction`, 'FTN');
        Player.delete(player, 'Faction');
        faction?.write('members', members);
        return true;
    }
    /**
     * Get faction's members
     * @param {string} name name of the faction
     * @returns {}
     */
    getMembers(id) {
        //Change to Database.allTables('FTM')
        const factions = Database.allTables('FTN'), faction = factions.find(f => f === name);
        if (!faction)
            return [];
        const db = this.find(faction);
        return db.read('members');
    }
    /**
     * Get faction's member role
     * @param {PlayerType} player player to get role
     * @returns {string}
     */
    getMemberRole(player) {
        if (!Player.read(player, 'FTN'))
            return;
        const faction = this.getFaction(player);
        return this.getMembers(faction).find(member => member.name === player.name || member.id === player.id)?.role;
    }
    /**
     * Get faction's owner id
     * @param {string} name faction name
     * @returns {string}
     */
    getOwnerId(name) {
        return this.find(name)?.read('ownerId');
    }
    /**
    * Get faction's owner name
    * @param {string} name faction name
    * @returns {string}
    */
    getOwnerName(name) {
        return this.find(name)?.read('ownerName');
    }
    /**
     * Get faction's power
     * @param {string} name faction name
     * @returns {number}
     */
    getPower(name) {
        if (!has({ name: name }))
            return;
        return this.find(name)?.read('power');
    }
    /**
     * Get faction's max power
     * @param {string} name faction name
     * @returns {number}
     */
    getMaxPower(name) {
        if (!has({ name: name }))
            return;
        return this.find(name)?.read('maxPower');
    }
    /**
     * Get faction's money
     * @param {string} name faction name
     * @returns {number}
     */
    getMoney(name) {
        if (!has({ name: name }))
            return undefined;
        return this.find(name)?.read('money');
    }
    /**
     * Get faction's kills
     * @param {string} name faction name
     * @returns {number}
     */
    getKills(name) {
        if (!has({ name: name }))
            return undefined;
        return this.find(name)?.read('kills');
    }
    /**
     * Get faction's spawnpoint
     * @param {string} name faction name
     * @returns {[number, number, number, string]}
     */
    getSpawnpoint(name) {
        if (!has({ name: name }))
            return undefined;
        return this.find(name)?.read('spawnPoint');
    }
    /**
     * @remarks Get faction's claims
     * @param {string} name Name of the faction you want to get the claims from
     * @returns {[number. number][]}
     */
    getClaims(name) {
        if (!has({ name: name }))
            return undefined;
        return Claim.getFactionClaims(name);
    }
    /**
     * @remarks Get faction's status
     * If you can only join this faction with invite it will return false
     * @param {string} name name of the faction
     * @returns {boolean}
     */
    getStatus(name) {
        if (!has({ name: name }))
            return undefined;
        return this.find(name).read('open');
    }
    /**
     * @remarks Get faction's alliases
     * @param {string} name name of the faction
     * @returns {boolean}
     */
    getAllies(name) {
        if (!has({ name: name }))
            return [];
        return this.find(name).read('allies');
    }
    /**
     * @remarks Check if faction is full power
     * @param {string} name name of the faction
     * @returns {boolean}
     */
    isFullPower(name) {
        if (!has({ name: name }))
            return;
        if (this.getPower(name) === this.getMaxPower(name))
            return true;
        return false;
    }
    /**
     * @remarks Get faction's description
     * @param {string} name name of the faction
     * @returns {boolean}
     */
    getDescription(name) {
        if (!has({ name: name }))
            return undefined;
        return this.find(name).read('description');
    }
    /**
     * Set faction's spawnpoint
     * @param {string} name faction name
     * @returns {boolean}
     */
    setSpawnpoint(player) {
        if (!this.playerInFaction(player))
            return (Player.error(player, `You are not member of any faction`, 'FTN'),
                false);
        const name = this.getFaction(player);
        if (!has({ name: name }))
            return false;
        Player.send(player, 'Succesfully changed your faction\'s spawnpoint', 'FTN');
        this.find(name)?.write('spawnPoint', [Object.values(player.location), player.dimension.id].flat());
        return true;
    }
    /**
     * Set faction's description
     * @param {PlayerType} player Player who will change their faction description
     */
    setDescription(player, description) {
        if (!this.playerInFaction(player))
            return (Player.error(player, `You are not member of any faction`, 'FTN'),
                false);
        const name = this.getFaction(player);
        if (!has({ name: name }))
            return false;
        Player.send(player, `Succesfully changed your faction's description`, 'FTN');
        this.find(name)?.write('description', description);
        return true;
    }
    /**
     * Set faction's member role
     * @param {PlayerType} player Player who will be given the role
     * @param role role that will be given to the player
     * @param sender Player who will put the role
     * @returns {boolean}
     */
    setRole(player, role, sender) {
        if (!this.playerInFaction(sender))
            return (Player.error(sender, `You are not member of any faction`, 'FTN'),
                false);
        if (!this.playerInFaction(player))
            return (Player.error(sender, `§6${player.name}§e is not member of any faction`, 'FTN'),
                false);
        const senderFaction = this.getFaction(sender), targetFaction = this.getFaction(player);
        if (senderFaction !== targetFaction)
            return (Player.error(sender, `§6${player.name} §eis not member of your faction`),
                false);
        if (!this.exist(senderFaction) || !this.exist(targetFaction))
            return false;
        const roles = {
            'owner': 4,
            'co-owner': 3,
            'admin': 2,
            'member': 1
        };
        if ((this.getOwnerId(senderFaction) === sender.id && this.getOwnerName(senderFaction) === sender.name) && (sender.id === player.id || sender.name === player.name))
            return (Player.error(sender, `You can't change your role because you are the owner!`, 'FTN'),
                false);
        if (roles[Faction.getMemberRole(sender)] < roles[Faction.getMemberRole(player)])
            return (Player.error(sender, `You cannot change the role of §6${player.name}§e because your role is lower`, 'FTN'),
                false);
        const faction = this.find(senderFaction), membersFormatted = this.getMembers(senderFaction).map((member) => {
            if (member.id === player.id || member.name === player.name)
                return { name: member.name, id: member.id, role, joinDate: member.joinDate };
            return member;
        });
        Player.send(sender, `Succesfully changed §6${player.name} §erole to §b${role}`, 'FTN');
        Player?.send(player, `§6${sender.name}§e has changed your role to §b${role}`, 'FTN');
        faction.write('members', membersFormatted);
        return true;
    }
    /**
     * @remarks Get player faction
     * @param {PlayerType} player
     * @returns {string}
     */
    getFaction(player) {
        return Player.read(player, 'Faction');
    }
    /**
     * @remarks Deposit money in your faction
     * @param {Player} player Player who will deposit the money
     * @param {number} quantity Amount of money you will deposit
     * @returns
     */
    deposit(player, quantity) {
        if (!this.playerInFaction(player))
            return (Player.error(player, `You are not member of any faction`, 'FTN'),
                false);
        const name = this.getFaction(player);
        if (!has({ name: name }))
            return false;
        const faction = this.find(name);
        const money = Player.getScore(player, config.obj);
        if (quantity > money)
            return (Player.error(player, `You don't have enough money`, 'FTN'),
                false);
        Player.send(player, `You have successfully deposited §6${quantity} §emoney into your faction`, 'FTN');
        player.runCommandAsync(`scoreboard players remove @s ${config.obj} ${quantity}`);
        faction.write('money', this.getMoney(name) + quantity);
        return true;
    }
    /**
     * @remarks Take money from your faction
     * @param {Player} player Player who will take the money
     * @param {number} quantity Amount of money you will take
     * @returns
     */
    withdraw(player, quantity) {
        if (!this.playerInFaction(player))
            return (Player.error(player, `You do not have a faction to withdraw in!`, 'FTN'),
                false);
        const name = this.getFaction(player);
        if (!has({ name: name }))
            return false;
        const faction = this.find(name), money = this.getMoney(name);
        const validRoles = ['owner', 'co-owner', 'admin'];
        //Check if the sender has any of the roles which allow it to use this command.
        if (!validRoles.includes(Faction.getMemberRole(player)))
            return (Player.error(player, `You don't have permission to take money from your faction`, 'FTN'),
                false);
        if (money < quantity)
            return (Player.send(player, `Your faction does not have enough money!`, 'FTN'),
                false);
        Player.send(player, `You have successfully withdrew §6${quantity} §emoney from your faction's bank`, 'FTN');
        player.runCommandAsync(`scoreboard players add @s ${config.obj} ${quantity}`);
        faction.write('money', this.getMoney(name) - quantity);
        return true;
    }
    /**
     * @remarks Upgrade your faction
     * @param {Player} player Player who will upgrade their faction
     * @returns
     */
    upgrade(player) {
        if (!this.playerInFaction(player))
            return (Player.error(player, `You are not member of any faction`, 'FTN'),
                false);
        const name = this.getFaction(player);
        if (!has({ name: name }))
            return false;
        const validRoles = ['owner', 'co-owner', 'admin'];
        //Check if the sender has any of the roles which allow it to use this command.
        if (!validRoles.includes(Faction.getMemberRole(player)))
            return (Player.error(player, 'You do not have permission to upgrade your faction!', 'FTN'),
                false);
        const faction = this.find(name);
        const money = this.getMoney(name);
        if (config.upgradePrice > money)
            return (Player.error(player, `Your faction does not have enough money`, 'FTN'),
                false);
        Player.send(player, `You have successfully upgraded your faction!`, 'FTN');
        faction.write('money', Faction.getMoney(name) - config.upgradePrice);
        faction.write('maxPower', this.getMaxPower(name) + config.maxPowerPerUpgrade);
        return true;
    }
    /**
     * @remarks Invite a player to your faction
     * @param {PlayerType} sender Player who sent the invite
     * @param {PlayerType} target player who will receive the invitation
     * @returns
     */
    invite(sender, target) {
        if (!this.playerInFaction(sender))
            return Player.send(sender, 'How do you plan to invite someone if you\'re not even in a faction?', 'FTN');
        const name = this.getFaction(sender);
        if (!has({ name: name }))
            return false;
        //Check if target is in faction
        if (this.playerInFaction(target)) {
            if (this.getFaction(target) === name) {
                //Target is on sender faction
                Player.error(sender, 'This player is already in your faction!', 'FTN');
                return false;
            }
            //Target is already in a faction (not sender's faction)
            Player.error(sender, `§6${target.name}§e is member of another faction!`, 'FTN');
            return false;
        }
        Player.send(sender, `You have invited §6${target.name}§e to your faction`, 'FTN');
        Player.send(target, `§6${sender.name}§e has invited you to join their faction! write §6${quick.prefix}f accept ${sender.name} §eto accept the invitation§r`, 'FTN');
        this.invites.push({ sender: [sender.name, sender.id], target: [target.name, target.id], expiresIn: Date.now() + config.inviteExpireTime });
    }
    /**
     * @remarks Accept faction's invitation
     * @param {PlayerType} player Player who received the invitation
     * @param {PlayerType} sender Player who sent the invite
     * @returns
     */
    acceptInvite(player, sender) {
        const invite = this.invites.find(inivite => (inivite.target[0] === player.name || inivite.target[1] === player.id) && (inivite.sender[0] === sender.name || inivite.sender[1] === sender.id));
        if (!invite)
            return Player.send(player, `You have no pending invitations from §6${sender.name}`, 'FTN');
        if (!this.playerInFaction(sender))
            return Player.send(player, `Ups! it seems that §6${sender.name}§e has left their faction`, 'FTN');
        const name = this.getFaction(sender);
        if (!has({ name: name }))
            return false;
        this.invites.splice(this.invites.indexOf(invite), 1);
        this.join(player, Faction.getFaction(sender), sender);
    }
    /**
     * @remarks Cancel faction's invitation
     * @param {PlayerType} player Player who received the invitation
     * @param {PlayerType} sender Player who sent the invite
     * @returns
     */
    cancelInvite(player, sender) {
        const invite = this.invites.find(inivite => (inivite.target[0] === player.name || inivite.target[1] === player.id) && (inivite.sender[0] === sender.name || inivite.sender[1] === sender.id));
        if (!invite)
            return Player.send(player, `You have no pending invitations from §6${sender.name}`, 'FTN');
        Player.send(player, `You have canceled §6${sender.name}'s §einvitation`, 'FTN');
        Player.send(sender, `§6${player.name}§e has canceled the invitation you sent to join your faction`, 'FTN');
        this.invites.splice(this.invites.indexOf(invite), 1);
    }
}
const Faction = new FactionBuilder();
export default Faction;
