'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

/**
 * TokenError extends RangeError
 * An Error related to setting banlist auto-update timer.
 * Notable token errors include `No token` and `Bad token`.
 *
 * @type {TokenError}
 */

const TokenError = class TokenError extends RangeError {
  /**
   * Constructor - Sets the name of this TokenError
   *
   * @constructor
   * @param  {*}  message  The message of the Error.
   */

  constructor(message) {
    super(message);
    this.name = 'TokenError';
  }
};

exports.TokenError = TokenError;
