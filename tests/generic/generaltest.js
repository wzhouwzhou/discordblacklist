'use strict';
/* eslint no-console: "off" */

// Create the object (which autorefr
// eshes the banlist every 120 minutes)
const { Blacklist, BanStore } = require('../..');

const EventEmitter = require('events');
const E = new EventEmitter;

const CREATE = 1;
const UPDATE = 1 << 1;
const LOOKUP = 1 << 2;
const STRINGIFY = 1 << 3;
const SERIALIZE = 1 << 4;
const ARRAY = 1 << 5;
const BANSTORE = 1 << 6;

const errors = [];
const passes = [];

const checkEnd = () => {
  if (errors.length > 0) {
    console.log(`### ${errors.length} Test(s) Failed, ${passes.length} Succeeded`);
    console.log(new Error(errors.map(e => `**${e.message}**\n${e.stack}`).join(`\n${'='.repeat(12)}\n`)));
    process.exit(1);
  } else {
    console.log(`### All ${passes.length} General Tests Passed\n\n`);
    process.exit(0);
  }
};
E.on('checkEnd', checkEnd);

const GenericDemoTest = class GenericDemoTest {
  constructor(testToken = 'My-token') {
    this.token = testToken;
  }

  testSetup(token = this.token) {
    process.stdout.write('### Creating the blacklist...');
    const blacklist = new Blacklist({ token, update: true });
    this.blacklist = blacklist;
    console.log('Done.\n');
    passes.push(CREATE);
  }

  testUpdate() {
    process.stdout.write('### Updating blacklist...');
    let hrTime = process.hrtime();
    const now = (1000000 * hrTime[0]) + (hrTime[1] / 1000);

    return this.blacklist.update().then(banstore => {
      hrTime = process.hrtime();
      const time = ((1000000 * hrTime[0]) + (hrTime[1] / 1000) - now) / 1000;

      console.log(`Done after ${time.toFixed(2)} ms.`);
      console.log(`---> Blacklist banstore updated with ${banstore.size} banned users.\n`);

      passes.push(UPDATE);
      return this.blacklist;
    }).catch(err => {
      errors.push(err);
      E.emit('checkEnd', this);
    });
  }

  testLookup() {
    const someID = '193841489854332928';
    process.stdout.write(`### Checking if a Discord User with the ID ${someID} is on the banlist: `);

    let user = this.blacklist.lookup(someID);
    console.log(!!user);
    if (user) {
      const { id, tag, banID, bannedFor, proofLink } = user;
      console.log(`---> Found banned user #${banID}: ${tag} with id ${id}, banned for: ${bannedFor}|${proofLink}\n`);
    }

    passes.push(LOOKUP);
    return this;
  }

  testStringify() {
    process.stdout.write(`### Stringifying Banlist in JSON...`);

    const jsonified = this.blacklist.banstore.stringify(-1, true);
    console.log(`Generated JSON string of length ${jsonified.length}`);

    process.stdout.write(`### Stringifying Banlist in Base64...`);
    const bufferstring = this.blacklist.banstore.stringify(-1, false);
    console.log(`Generated Base64 string of length ${bufferstring.length}`);

    if (jsonified === bufferstring && JSON.parse(jsonified)) return errors.push(new Error('Base64 failbacked on JSON'));

    passes.push(STRINGIFY);
    return this;
  }

  testSerialize() {
    process.stdout.write(`### Generating Object with serialize()...`);
    this.blacklist.banstore.serialize();
    console.log('Done.\n');

    passes.push(SERIALIZE);
    return this;
  }

  testArray() {
    process.stdout.write(`### Generating Array with array()...`);
    const array = this.blacklist.banstore.array();
    console.log('Done.\n');
    const banneduser = array[0];
    const sameBanneduser = this.blacklist.banstore.get('1');
    if (!Object.is(banneduser, sameBanneduser)) {
      return errors.push(new Error('Array and map get failed to return the same BannedUser'));
    }

    passes.push(ARRAY);
    return this;
  }

  testBanStore() {
    console.log(`### Testing BanStore creation data parsing...`);
    process.stdout.write('---> Array from array() ...');
    const objects = [];
    const a = new BanStore(this.blacklist.banstore.array());
    objects.push(a);
    console.log(`Done. ${a.size} BannedUsers\n`);

    process.stdout.write('---> Object (from serialize)');
    const b = new BanStore(this.blacklist.banstore.serialize());
    objects.push(b);
    console.log(`Done. ${b.size} BannedUsers\n`);

    process.stdout.write('---> String (JSON)');
    const c = new BanStore(this.blacklist.banstore.stringify(-1, true), true);
    objects.push(c);
    console.log(`Done. ${c.size} BannedUsers\n`);

    process.stdout.write('---> String (Base64)');
    const d = new BanStore(this.blacklist.banstore.stringify(-1, false));
    objects.push(d);
    console.log(`Done. ${d.size} BannedUsers\n`);

    if (!objects.every((current, i, o) => {
      const first = o[0];
      if (current.size !== first.size) return false;

      const cKeys = Array.from(current.keys());
      const fKeys = Array.from(first.keys());

      if (cKeys.length !== fKeys.length || cKeys.length !== first.size) return false;

      return cKeys.every(key => {
        if (!~fKeys.indexOf(key)) return false;
        if (!first.get(key).equals(current.get(key))) return false;
        return true;
      });
    })) {
      return errors.push(new Error('Not all BanStores created from the same data were equal'));
    }

    passes.push(BANSTORE);
    return this;
  }

  run() {
    this.testSetup();
    return this.startTest();
  }

  startTest() {
    return this.testUpdate().then(() => {
      this.testLookup();
      this.testStringify();
      this.testSerialize();
      this.testArray();
      this.testBanStore();
      E.emit('checkEnd', this);
    }).catch(err => {
      errors.push(err);
      E.emit('checkEnd', this);
    });
  }
};


try {
  const test = new GenericDemoTest();

  console.log('\n\n>Starting Tests<\n');

  test.run();
} catch (err) {
  errors.push(err);
  E.emit('checkEnd', err);
}
