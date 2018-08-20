'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

const https = require('https');

const default_options = {
  hostname: 'bans.discord.id',
  path: '/api/check.php',
  headers: { 'Cache-Control': 'no-cache' },
};

const option_store = new WeakMap;

const regex = new RegExp(/^\d+$/);

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
    if (!regex.test(id)) Promise.reject(new Error('Discord User Snowflake ID must contain only numbers.'));
    const options = Object.assign({}, option_store.get(this));
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
    if (!Array.isArray(ids) || ids.length < 2) {
      return Promise.reject(new Error('You must define an array with 2 or more ID\'s defined.'));
    }
    let validIDs = ids.filter(id => regex.test(id));
    if (validIDs.length > 99) {
      return Promise.reject(new Error(`More than 99 ID's for bulk lookup are not allowed!`));
    }
    const options = Object.assign({}, option_store.get(this));
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

  async isBanned(id) {
    if (regex.test(id)) throw new Error('Discord User Snowflake ID must contain only numbers.');
    return !!(await this.lookup(id)).banned;
  }
};
Searcher.Searcher = Searcher.default = Searcher;
exports.default = Searcher;
