<div align="center">
    <br />
    <p>
        <a href="https://www.npmjs.com/package/discordblacklist"><img src="https://img.shields.io/npm/v/discordblacklist.svg" alt="NPM version" /></a>
        <a href="https://www.npmjs.com/package/discordblacklist"><img src="https://img.shields.io/npm/dt/discordblacklist.svg" alt="NPM downloads" /></a>
        <a href="https://travis-ci.org/wzhouwzhou/discordblacklist"><img src="https://travis-ci.org/wzhouwzhou/discordblacklist.svg" alt="Build Status" /></a>
        <a href="https://david-dm.org/wzhouwzhou/discordblacklist"><img src="https://img.shields.io/david/wzhouwzhou/discordblacklist.svg" alt="Dependencies" /></a>
        <a href="https://snyk.io/test/npm/discordblacklist"><img src="https://snyk.io/test/npm/discordblacklist/badge.svg" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/npm/discordblacklist" style="max-width:100%;"></a>
        <a href="https://paypal.me/wzhouwzhou"><img src="https://img.shields.io/badge/donate-paypal-009cde.svg" alt="Paypal" /></a>
    </p>
    <p>
        <a href="https://nodei.co/npm/discordblacklist/"><img src="https://nodei.co/npm/discordblacklist.png?stars=true&downloads=true"></a>
    </p>
</div>

# Discordblacklist
## The Featured Nodejs package that facilitates getting banned Discord users from DiscordBans.

### Installing via NPM.

```$ npm install --save discordblacklist@3.1.1 --only=production```

**Note: Version 3.1.x package API has changed from previous versions, all previous versions are deprecated following a rewrite of the discordbans api as well as changed domains and removed features.**

**Why discordblacklist?**

• Fast, Light, and No bloat (Yes! Actually works with No other dependencies!), packed size is ~15kB

• Updated and Modern (Code standards and checks ensure code quality and aim for 0 vulnerabilities)

• Popular and Safe - the Oldest and Most Trusted Full-Coverage package with thousands of downloads, actively maintained by a verified DBans staff member.

### I'm sold! How do I begin?

    // Create the object
    const Blacklist = require('discordblacklist');
    const token = 'My-token';
    const blacklist = new Blacklist(token);

    // Someone's id to test
    const someID = '1234567890';

    // Raw data from the banlist
    let data = await blacklist.lookup(someID);
    console.log(data);
    // No await:
    blacklist.lookup(someID).then(result => console.log(result));

    // Boolean they are on the banlist:
    let onTheList = await blacklist.isBanned(someID);
    console.log(onTheList);
    // No await:
    blacklist.isBanned(someID).then(result => console.log(result));

    // Bulk lookup several users
    const ids = ['12345', '123456', '1234567'];
    data = await blacklist.bulkLookup(ids);
    // No await:
    blacklist.bulkLookup(ids).then(result => console.log(result));

**Changing token**

If for whatever reason you would like to switch tokens, you can do that easily by calling.
```blacklist.changeToken('newtoken');```

This work is ©Copyright under the `GNU AFFERO GENERAL PUBLIC LICENSE Version 3`. See LICENSE for more details.

Enjoy this package? Consider starring on [github](https://github.com/wzhouwzhou/discordblacklist) and checking out some of my other work:

[Youtube Search API](https://npmjs.com/ytsearcher)

[Fluent Filepaths](https://npmjs.com/easypathutil)

[Urban Dictionary](https://npmjs.com/easyurban)

Contact William Zhou#0001 via https://discord.gg/jj5FzF7 for more information.
