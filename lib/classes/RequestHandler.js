'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

const snekfetch = require('snekfetch');

const { API, VERSION, REPO } = require('../deps/Constants');
const { TokenError, ConnectionError } = require('../deps/ErrorEnum');

const _tokens = new WeakMap;
const _protect = Symbol('_protect');
const _auth = Symbol('_auth');

/**
 * A Blacklist's RequestHandler that interacts with the Discord Bans API
 *
 * @private
 * @type {RequestHandler}
 */

const RequestHandler = class RequestHandler {
  /**
   * Constructs a RequestHandler
   *
   * @constructor
   * @param  {Blacklist}    blacklist    - The blacklist that uses this RequestHandler.
   * @param  {TokenOptions} tokenOptions - The token settings of this RequestHandler.
   */

  constructor(blacklist, { token, protect = true, auth = false } = {}) {
    this._blacklist = blacklist;
    Object.defineProperty(this, _protect, { value: protect });

    Object.defineProperty(this, _auth, { value: auth });
    _tokens.set(this, token);

    Object.defineProperty(this, 'version', { value: 3 });
  }

  /**
   * Sets the token of this RequestHandler.
   *
   * @instance
   * @memberof RequestHandler
   * @method setToken
   * @param  {string} newtoken - The new token to set
   * @param  {string} oldtoken - If auth is enabled, the old token must be supplied
   * @return {boolean} True if the token was updated.
   */

  setToken(newtoken, oldtoken) {
    if (newtoken === oldtoken) return true;

    if (this[_auth]) {
      if (!oldtoken) return false;
      if (_tokens.get(this) !== oldtoken) return false;
    }

    _tokens.set(this, newtoken);
    return true;
  }

  /**
   * Gets the token of this RequestHandler.
   *
   * @readonly
   * @instance
   * @memberof RequestHandler
   * @method token
   * @return {(string|undefined)} The token if key protection is disabled, or undefined.
   */

  get token() {
    if (this[_protect]) return undefined;
    return _tokens.get(this);
  }

  /**
   * Performs a post request to the DiscordBans api
   *
   * @protected
   * @instance
   * @memberof RequestHandler
   * @method _fetch
   * @param  {string} [token=_tokens.get(this)] - The token to use in the request
   * @return {Object} An object containing two keys: lobj - the data in Object form, and lstr - the data in string form.
   */

  _fetch(token = _tokens.get(this)) {
    return new Promise(async (res, rej) => {
      if (!token || token === '') return rej(new TokenError('No token'));

      try {
        const result = await snekfetch.post(API)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('user-agent',
            `discordblacklist/${VERSION} (node v${process.version}) ${process.platform} (${process.arch}) (+${REPO})`)
          .send({
            token,
            version: this.version,
          });

        if (result.status !== 200) return rej(new ConnectionError(`Status ${result.status}`));
        if (!result.body) return rej(new ConnectionError('Missing body'));

        if (result.text.match(/no\s*token\s*specified/i)) return rej(new TokenError('No token'));
        if (result.text.match(/invalid\s*token/i)) return rej(new TokenError('Bad token'));

        const lstr = result.text.replace(/\s+/g, '');
        const lobj = JSON.parse(result.body);
        return res({ lstr, lobj });
      } catch (err) {
        return rej(err);
      }
    });
  }
};

exports.RequestHandler = RequestHandler;
