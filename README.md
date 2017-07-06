
# discordblacklist
## A nodejs package that facilitates getting banned Discord users from DiscordBans

### Installing via NPM.

```$ npm install discordblacklist```
### Setup and functions.
**Creating the object:**

    const Blacklist = require('discordblacklist'),
    banlist = new Blacklist('token');
Get a token [here](https://bans.discordlist.net/mytoken).
<br></br>
The object will try to update its banlist on creation, however you can update the list manually at any time.

<br></br>
**To update the ban list manually:**
```banlist.update();```

This returns promise, and you can get the ban list from it with either the thenable or `banlist.list` or the thenable of `banlist.array()`.
<br></br>
**It is recommended you update your ban list every two hours**
<br></br>
You can have the blacklist autoupdate the list like so:
<br></br>
```const banlist = new Blacklist('token', true, 2*60); ```
<br></br>
To specify your own auto-update interval, create your object like so:
<br></br>
`new Blacklist('token', true, minutes);`

**Clearing and resetting your auto-updater**
<br></br>
To clear the autoupdater simply call ``banlist.stopUpdateTimer();``. To then set a new one do ``banlist.setUpdateTimer(minutes)``.

**Looking up users.**
<br></br>
```banlist.lookup("id")``` where id is the userid of the user you want to check. This returns a boolean depending on if the user is on the ban list.

**Changing token**
<br></br>
If for whatever reason you would like to switch tokens mid-execution, you can do that easily by calling
```banlist.changeToken('newtoken');```
<br></br>

### Summary example:

    //Create the object (which autorefreshes the banlist every 120 minutes)
    const Blacklist = require('discordblacklist');
    let banlist = new Blacklist('token', true, 120);

    //Someone's id to test
    const someID = '1234567890';

    //Check if they are on the banlist
    let isOnTheBanList = banlist.lookup(someID);

    //Get the full list in string form
    console.log(banlist.list);

    //Get the full list as an array
    console.log(await banlist.array());
