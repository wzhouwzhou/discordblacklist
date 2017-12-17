<div align="center">
    <br />
    <p>
        <a href="https://www.npmjs.com/package/discordblacklist"><img src="https://img.shields.io/npm/v/discordblacklist.svg" alt="NPM version" /></a>
        <a href="https://www.npmjs.com/package/discordblacklist"><img src="https://img.shields.io/npm/dt/discordblacklist.svg" alt="NPM downloads" /></a>
        <a href="https://travis-ci.org/wzhouwzhou/discordblacklist"><img src="https://travis-ci.org/wzhouwzhou/discordblacklist.svg" alt="Build Status" /></a>
        <a href="https://david-dm.org/wzhouwzhou/discordblacklist"><img src="https://img.shields.io/david/wzhouwzhou/discordblacklist.svg" alt="Dependencies" /></a>
        <a href="https://paypal.me/wzhouwzhou"><img src="https://img.shields.io/badge/donate-paypal-009cde.svg" alt="Paypal" /></a>
    </p>
    <p>
        <a href="https://nodei.co/npm/discordblacklist/"><img src="https://nodei.co/npm/discordblacklist.png?stars=true&downloads=true"></a>
    </p>
</div>

# Discordblacklist
## The Featured Nodejs package that facilitates getting banned Discord users from DiscordBans.

### Installing via NPM.

```$ npm install --save discordblacklist```

or to use JSON only for stringifying/serializing (more info below)

```$ npm install --save discordblacklist --no-optional```

**Note: Version 2.x API has changed from version 1.x to support DiscordBans v3 api. Version 2.x is not backwards compatible with version 1.x code. Package dependencies have also been updated so make sure you npm install properly.**

The following contains documentation for discordblacklist 2.0.0, read the 1.0.7 (the latest 1.x) documentation [here](https://github.com/wzhouwzhou/discordblacklist/releases/tag/v1.0.7)


### Quickstart:

    // Create the object (which autorefreshes the banlist every 120 minutes)
    const { Blacklist } = require('discordblacklist');
    const token = 'My-token';
    const blacklist = new Blacklist({ token, update: true });

    // Update the blacklist.
    await blacklist.update();

    // Someone's id to test
    const someID = '1234567890';

    // Check if they are on the banlist - Returns either null or the BannedUser.
    let user = blacklist.lookup(someID);

    // Get the full list in string JSON form. Must be used after update() has completed
    const jsonified = blacklist.banstore.stringify(-1, true);
    console.log(jsonified);

    // If you installed optional dependencies (erlpack) use this.
    const bufferstring = blacklist.banstore.stringify(-1, false);
    console.log(bufferstring);

    // If you want an Array of BannedUser objects
    const array = blacklist.banstore.array();

    // The first user on the banlist
    const banneduser = array[0];
    const sameBanneduser = blacklist.banstore.get('1');
    console.log(banneduser);

### Setup and functions.

**Exports:**

`require('discordblacklist')` will return an Object with several keys: Blacklist, Errors, BanStore, and Constants.

The Blacklist class can be set with

    const { Blacklist } = require('discordblacklist');

There are several ways to create an object from it, here's the simplest:

    const apiToken = '12345'; // Replace with actual token
    const blacklist = new Blacklist(apiToken);

Get a token [here](https://bans.discordlist.net/mytoken).

To update the list Manually

    const newlist = await blacklist.update();

To get the list quickly without updating unless the internal cache was deleted blacklist.fetchBanlist();

    const list = await blacklist.fetchBanlist();

list and newList will contain a <BanStore> object which is a collection of BannedUser objects mapped by their banID. BannedUser objects have an id (userid), tag (discord tag), banID, bannedFor (reason), prooflink.

Used normally (i.e. caching enabled), BanStores will always be stored inside blacklist.banstore

To strip any class data and just get them in pure object form just run <BannedUser>.serialize() or <BanStore>.serialize(), and to stringify them <BannedUser> or <BanStore>.stringify().

**It is recommended you update your ban list every two hours**

You can have the blacklist autoupdate at the recommended time like so:

    const banlist = new Blacklist({ token: 'something', update: true });

to customise the timer length (180 minutes in this example):

    const banlist = new Blacklist({ token: 'something', update: 180 });

to be completely explicit:

    const banlist = new Blacklist({
      token: 'something',
      update: {
        autoupdate: true,
        minutes: 180,
      }
    });

**Looking up users.**

Convenience shortcut (only works after if banlist has been fetched and cached):

    blacklist.lookup('id');

'id' is the userid of the user you want to check. This returns either a BannedUser or null depending on if the user is on the ban list.

**Clearing and resetting your auto-updater**

To clear the autoupdater simply call ``banlist.stopUpdateTimer();``. To then set a new one do ``banlist.setUpdateTimer(minutes)`` where minutes is an number.

**Changing token**

If for whatever reason you would like to switch tokens, you can do that easily by calling.
```banlist.changeToken('newtoken');```

### Official examples for various frameworks and libraries are stored in the [examples](https://github.com/wzhouwzhou/discordblacklist/tree/master/examples) folder, visit the link to read more about them.

This work is ©Copyright under the `GNU AFFERO GENERAL PUBLIC LICENSE Version 3`. See LICENSE for more details.

### Further Documentation:
[https://discordblacklist.willyz.cf/](https://discordblacklist.willyz.cf/)

Enjoy this package? Consider starring on [github](https://github.com/wzhouwzhou/discordblacklist) and checking out some of my other work:

[Youtube Search API](https://npmjs.com/ytsearcher)

[Chips Discord Bot](https://chipsbot.me/)
