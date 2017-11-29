'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

let erlpack;
try {
  require.resolve('erlpack');
  erlpack = require('erlpack');
} catch (e) {
  erlpack = null;
}

const { PROOFPADREG } = require('../deps/Constants');

/**
 * Class to represent a Banned Discord user.
 *
 * @type {BannedUser}
 */

const BannedUser = class BannedUser {
  /**
   * An Array or plain object containing BannedUser data,
   * or the Banneduser in serialized form, or a string containing a BannedUser in stringified form.
   * id, tag, banID, bannedFor, proofLink
   * @property {string} id        - The userid of the BannedUser.
   * @property {string} tag       - The Discord tag of the BannedUser.
   * @property {number} banID     - The DiscordBans ban ID - The BannedUser is the "banID'th" DiscordBans user.
   * @property {string} bannedFor - The reason why the BannedUser was put on the Banlist.
   * @property {string} proofLink - A string containing links to evidence regarding why
   * the BannedUser is on the Banlist. May sometimes contain a DiscordBans redirect link.
   * @typedef {(string|Array|Object)} BannedUserData
   */

  /**
   * Constructs a BannedUser
   *
   * @constructor
   * @param  {BannedUserData} arr        - The data to populate this BannedUser with.
   * @param  {boolean} [json=false]      - Whether to use JSON when loading/stringifying/serializing.
   */

  constructor(arr, json = false) {
    Object.defineProperty(this, 'json', { value: !erlpack || json });
    this.load(arr);
  }

  /**
   * Populates this BannedUser with data.
   *
   * @instance
   * @memberof BannedUser
   * @method load
   * @param  {BannedUserData} [obj=null]              - The data to load.
   * @param  {boolean} [json=(!erlpack || this.json)] - Whether to consider using JSON if data is a string.
   * @return {BannedUser} The updated BannedUser
   */

  load(obj = null, json = (!erlpack || this.json)) {
    if (!obj) throw new Error('Nothing given to load');
    let array = obj;
    if (typeof array === 'string') {
      if (json) array = JSON.parse(array);
      else array = erlpack.unpack(new Buffer(obj, 'base64'));
    }
    if (!array || !(array instanceof Object)) throw new TypeError('Invalid data array given to load');

    if (array instanceof Object && !(array instanceof Array)) {
      return this._edit(array);
    } else if (Array.isArray(array)) {
      const [banID, tag, id, bannedFor, prelink] = array;
      // eslint-disable-next-line no-sparse-arrays, comma-spacing
      const proofLink = prelink.replace(PROOFPADREG, '');
      return this._edit({ id, tag, banID, bannedFor, proofLink });
    }
    throw new TypeError('Invalid data array given to load');
  }

  /**
   * Actually updates the BannedUser.
   *
   * @instance
   * @memberof BannedUser
   * @method _edit
   * @protected
   * @param  {BannedUserData} [obj=null] - The data to load.
   * @return {BannedUser} The updated BannedUser
   */

  _edit(opts = {}) {
    const { id, tag, banID, bannedFor, proofLink } = opts;
    this.id = id.replace(/\s+/g, '');
    this.tag = tag.trim();
    this.banID = banID.replace(/\s+/g, '');
    this.bannedFor = bannedFor.trim();
    this.proofLink = proofLink.replace(/\s+/g, '');
    return this;
  }

  /**
   * Serializes this BannedUser, returning a BannedUserData object
   *
   * @instance
   * @memberof BannedUser
   * @method serialize
   * @param  {boolean} [cache=false] - Whether to cache the serialized form in <BannedUser>._serialized.
   * @return {BannedUserData} An Object containing id, tag, banID, bannedFor, and proofLink keys.
   */

  serialize(cache = false) {
    const data = {
      id: this.id,
      tag: this.tag,
      banID: this.banID,
      bannedFor: this.bannedFor,
      proofLink: this.proofLink,
    };
    if (cache) Object.defineProperty(this, '_serialized', { value: data, configurable: !0 });
    return data;
  }

  /**
   * Getter for <BannedUser>.serialize(). If previously cached, returns the cached object,
   * otherwise returns an updated BannedUserData.
   *
   * @readonly
   * @instance
   * @memberof BannedUser
   * @method serialized
   * @return {BannedUserData} An Object containing id, tag, banID, bannedFor, and proofLink keys.
   */

  get serialized() {
    if (!this._serialized) return this.serialize(false);
    return this._serialized;
  }

  /**
   * Stringifies this BannedUser.
   *
   * @instance
   * @memberof BannedUser
   * @method stringify
   * @param  {boolean}  cache                          - Whether to cache the stringified form into
   * <BannedUser>._stringified.
   * @param  {boolean}  [json=(!erlpack || this.json)] - Whether to use JSON to stringify.
   * @return {string} The stringified form of this BannedUser
   */

  stringify(cache = false, json = (!erlpack || this.json)) {
    const data = this.serialize(cache);

    let stringified;

    if (json) stringified = JSON.stringify(data);
    else stringified = erlpack.pack(data).toString('base64');

    if (cache) Object.defineProperty(this, '_stringified', { value: stringified, configurable: !0 });

    return stringified;
  }
};

exports.BannedUser = BannedUser;