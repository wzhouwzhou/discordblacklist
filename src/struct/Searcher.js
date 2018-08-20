'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

const https = require('https');

const default_options = {
  hostname: 'bans.discord.id',
  path: '/api/check.php',
  headers: { 'Cache-Control': 'no-cache' },
};

const option_store = new WeakMap;

const Searcher = class Searcher {
  constructor(token) {
    option_store.set(this, Object.assign({}, default_options));
    this.changeToken(token);
  }

  changeToken(newtoken) {
    option_store.get(this).headers.Authorization = newtoken;
    return this;
  }

  lookup(id) {
    if (!/^\d+$/.test(id)) Promise.reject(new Error('Discord User Snowflake ID must contain only numbers.'));
    const options = option_store.get(this);
    options.path += `?user_id=${id}`;
    return new Promise((res, rej) => {
      const req = https.get(options, response => {
        const { statusCode } = response;
        if (statusCode !== 200) {
          rej(new Error(`Request Failed.\nStatus Code: ${statusCode}`));
          return response.resume();
        }
        let chunks = [];
        response.on('data', chunk => chunks.push(chunk));
        return response.on('end', () => res(JSON.parse(Buffer.concat(chunks).toString())[0]));
      });
      req.end();
    });
  }

  bulkLookup(ids) {
    if (!ids[0] || ids.length < 2) Promise.reject(new Error('You must define an array with 2 or more ID\'s defined.'));
    let validIDs = [];
    for (let id of ids) {
      if (!/^\d+$/.test(id)) {
        console.log(`ID ${id} was not a Discord Snowflake, skipping...`);
        continue;
      }
      else {
        validIDs.push(id);
      }
    }
    if (validIDs.length > 99) {
      Promise.reject(new Error(`More than 99 ID's for bulk lookup are not allowed!`));
    }
    else {
      const options = option_store.get(this);
      let path = `?user_id=${validIDs[0]}`;
      for (let id of validIDs) {
        path += `&user_id=${id}`;
      }
      options.path += path;
      return new Promise((res, rej) => {
        const req = https.get(options, response => {
          const { statusCode } = response;
          if (statusCode !== 200) {
            rej(new Error(`Request failed. Status Code: ${statusCode}`));
            return response.resume();
          }
          let chunks = [];
          response.on('data', chunk => chunks.push(chunk));
          return response.on('end', () => res(JSON.parse(Buffer.concat(chunks).toString())));
        });
        req.end();
      });
    }
  }

  async isBanned(id) {
    if (!/^\d+$/.test(id)) throw new Error('Discord User Snowflake ID must contain only numbers.');
    return !!(await this.lookup(id)).banned;
  }
};
Searcher.Searcher = Searcher.default = Searcher;
exports.default = Searcher;
