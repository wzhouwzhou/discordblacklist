'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

let erlpack;
try {
  require.resolve('erlpack');
  erlpack = require('erlpack');
} catch (e) {
  erlpack = null;
}

const { BannedUser } = require('./BannedUser');

// ////////////// //
// BanStore Class //
// ////////////// //

/**
 * BanStore extends map
 * Class to represent a collection of BannedUsers, mapped by banID
 *
 * @type {BanStore}
 */

const BanStore = class BanStore extends Map {
  /**
   * Constructor - Creates a BanStore
   *
   * @constructor
   * @param  {(string|Array)}  users - A string or Array containing the BannedUsers to initialize the BanStore with.
   * @param  {boolean}  [json=false] - Whether to use JSON for stringifying or loading data.
   */
  constructor(users, json = false) {
    super();
    this.json = !erlpack || json;
    this.load(users);
  }

  /**
   * Loads new data into the BanStore.
   *
   * @instance
   * @memberof BanStore
   * @method load
   * @param  {(string|Array)} [obj=null]              - String or Array containing the data to load.
   * @param  {boolean} [json=(!erlpack || this.json)] - Whether to use JSON.parse to load.
   * If erlpack is not installed this will be forced to be true.
   * @return {BanStore} The updated BanStore object.
   */

  load(obj = null, json = (!erlpack || this.json)) {
    if (!obj) throw new Error('Nothing given to load');
    let array = obj;
    if (typeof array === 'string') {
      if (json) array = JSON.parse(array);
      else array = erlpack.unpack(new Buffer(obj, 'base64'));
    }
    if (!array || !Array.isArray(array)) throw new TypeError('Invalid data array given to load');
    array.forEach(preU => {
      const u = new BannedUser(preU, json);
      this.set(u.banID.trim(), u);
    });
    return this;
  }

  /**
   * Returns an Array of BannedUser objects in this BanStore.
   *
   * @instance
   * @memberof BanStore
   * @method array
   * @return {Array<BannedUser>} Array for BannedUsers
   */

  array() {
    return Array.from(this.values());
  }

  /**
   * Callback function called if looking up without a userid.
   *
   * @instance
   * @memberof BanStore
   * @callback BannedUserCallback
   * @param {string}     banID      - A banID of a BannedUser
   * @param {BannedUser} bannedUser - The BannedUser mapped to banID
   * @param {BanStore} banstore     - This BanStore object.
   */

  /**
   * Check if a banned user is on the banlist by their id or a {@link BannedUserCallback} callback function.
   *
   * @instance
   * @memberof BanStore
   * @method lookup
   * @param  {(string|BannedUserCallback)} uid - string to check userid against, or callback
   * @return {(BannedUser|null)} The BannedUser in question if found, or null.
   */

  lookup(uid) {
    if (typeof uid === 'string') {
      for (const user of this.values()) if (user.id === uid) return user;
      return null;
    } else if (typeof uid === 'function') {
      for (const [banID, bannedUser] of this) if (uid(banID, bannedUser, this)) return bannedUser;
      return null;
    } else {
      throw new TypeError('First argument must be a userid or a function.');
    }
  }

  /**
   * Serializes this BanStore
   *
   * @instance
   * @memberof BanStore
   * @method serialize
   * @param  {number}  [limit=-1]           - A limit to the first 'limit' BannedUsers to include in serialized form.
   * If -1, all BannedUsers in the BanStore are serialized.
   * @param  {boolean} [cache=limit !== -1] - A boolean whether to cache the serialized into <BanStore>._serialized.
   * If cache is not given, the caching will be enabled by default if a limit is not set (limit === -1).
   * @return {Array<BannedUser>}                        An array of serialized BannedUsers.
   */

  serialize(limit = -1, cache = limit !== -1) {
    const arr = Array.from(this.values()).map(u => u.serialize());
    if (limit !== -1) arr.length = limit;

    if (cache) Object.defineProperty(this, '_serialized', { value: arr, configurable: !0 });
    return arr;
  }

  /**
   * Getter for <BanStore>.serialize(). If previously cached, returns the cached Array,
   * otherwise returns an updated Array.
   *
   * @instance
   * @memberof Banstore
   * @method serialized
   * @return {Array<BannedUser>} An array of serialized BannedUsers.
   */

  get serialized() {
    if (!this._serialized) return this.serialize(-1);
    return this._serialized;
  }

  /**
   * Stringify this BanStore.
   *
   * @instance
   * @memberof BanStore
   * @method stringify
   * @param  {number}  [limit=-1]        - How many people on the banlist to stringify
   * @param  {boolean} [json=this.json]  - Whether to use JSON.stringify
   * @param  {boolean} [cache=true]      - Whether to internally cache the stringified content into
   * <BanStore>._stringified
   * @return {string} The stringified form of this BanStore
   */

  stringify(limit = -1, json = (!erlpack || this.json), cache = limit === -1) {
    const arr = Array.from(this.values()).map(u => u.stringify(cache, json));
    if (limit !== -1) arr.length = limit;

    let stringified;

    if (json) stringified = JSON.stringify(arr);
    else stringified = erlpack.pack(arr).toString('base64');

    if (cache) Object.defineProperty(this, '_stringified', { value: stringified, configurable: !0 });

    return stringified;
  }
};

exports.BanStore = BanStore;