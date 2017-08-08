
const needle = require('needle'),
      version = require('../package.json').version,
      repo = require('../package.json').github,
      apiUrl = 'https://bans.discordlist.net/api';

module.exports = class Blacklist {
  constructor (token, autoupdate = false, minutes = -1){
    this.token = token;
    this.autoupdate = autoupdate;
    if(isValidTimer(minutes))
    this.minutes = minutes;
    if(this.autoupdate)
      this.autoupdateTimer = setInterval(()=>this.update(), this.minutes * 60 * 1000);
    else
      this.autoupdateTimer = null;
    this.update();
  }

  changeToken (newtoken) {
    this.token = newtoken;
    return this;
  }

  setUpdateTimer (mins) {
    if(this.autoupdate && this.autoupdateTimer) return this.autoupdateTimer;
    if(isValidTimer(mins)){
      this.minutes = mins;
      let ms = mins * 60 * 1000;
      this.autoupdate = true;
      this.autoupdateTimer = setInterval(()=>this.update(), ms);
      return true;
    }else throw 'Blacklist: Invalid time given in minutes to set autoupdate!';
  }

  stopUpdateTimer () {
    if(this.autoupdate && this.autoupdateTimer){
      clearInterval(this.autoupdateTimer);
      this.autoupdate = false;
      this.autoupdateTimer = null;
      this.minutes = -1;
      return true;
    }
    return false;
  }

  update () {
    return new Promise((rres, rrej) => {
      new Promise( (res, rej) => handleUpdate.call (this, res, rej, this.token))
        .then(list => {
          this.list = list;
          rres(this.list);
        }).catch(rrej);
    });
  }

  lookup (id) {
    if (!this.list) throw ('Call update() before looking up users.');
    if (typeof id == 'string'){
      if(~this.list.indexOf(id)) return true;
      return false;
    }
    throw('Invalid user id given');
  }

  array () {
    return new Promise( async (res, rej) => {
      try{
        if(!this.list) await update();
      }catch(err) { rej(err); };

      let arr = [];
      for(const e of this.list.replace(/^\[|\]$/g,'').split(','))
        arr.push(JSON.parse(e)[0]);
      res(arr);
    });
  }
};

const handleUpdate = (res, reject, token) => {
  if (!token || token=='') reject('Invalid Token: You must set a valid token!');
  needle.post(apiUrl,
    { "token": token },
    {
      'Content-Type': 'application/x-www-form-urlencoded',
      'user-agent': `discordblacklist/${version} (node v${process.version}) ${process.platform} (${process.arch}) (+${repo})`,
    },
    (errored, response, d = this) => {
      if (errored!=null&&errored.description!='') reject (errored);
      else {
        if (response.body.includes('No token specified!'))
          reject ('You have not set a token!');
        else if (response.body.includes('Invalid token.'))
          reject ('You have an invalid token!');
        else
          res (response.body.replace(/\s+/g, ''));
      }
    }
  );
};

const isValidTimer = (minutes) => (+minutes)===minutes&&minutes===(minutes|0)&&minutes>0;
