const { Event } = require('klasa');
const { Blacklist } = require('discordblacklist');
const moment = require('moment');
const token = 'YOUR bans.discordlist.com TOKEN';

// ============================================================================================ //
// discordblacklist examples by Zack D. (@QuantumlyTangled/https://github.com/QuantumlyTangled).//
// ============================================================================================ //

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      name: 'guildMemberAdd',
      enabled: true,
    });
  }

  async run(member) {
    const banlist = new Blacklist(token, true, 120);
    await banlist.update();
    const isOnTheBanList = banlist.lookup(member.id);
    if (!isOnTheBanList) return null;
    const embed = new this.client.methods.Embed()
      .setAuthor('Discord bans auto detection')
      .setDescription(`The user ${member} has tested positive for being on the Discord bans list!`)
      .addField(`Ban ID:`, `${isOnTheBanList.banID}`, true)
      .addField(`Proof:`, `${isOnTheBanList.proofLink}`, true)
      .addField(`Reason:`, `${isOnTheBanList.bannedFor}`)
      .setColor(1)
      .setThumbnail('https://cdn.discordapp.com/icons/269262004852621312/4947742034342a5348f6117e3e1e94bd.webp?size=1024')
      .setFooter(`${this.client.user.username} | ${moment().format('MMMM Do YYYY, h:mm:ss a')}`, this.client.user.displayAvatarURL);
    const channel = member.guild.channels.get(member.guild.configs.welcome);
    if (!channel) member.guild.owner.send('There is no welcome channel detected, did it get deleted?');
    return channel.send({ embed });
  }

  init() {
    if (!this.client.gateways.guilds.schema.hasKey('welcome')) {
      return this.client.gateways.guilds.schema.addKey('welcome', { type: 'Channel', default: null });
    }
    return null;
  }
};
