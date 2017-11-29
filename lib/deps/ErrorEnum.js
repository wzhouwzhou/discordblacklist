'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

/**
 * An Object of custom errors.
 *
 * @type {Object}
 * @module ErrorEnum
 */


/**
 * TokenError - An Error related to authenticating with the Discord Bans API.
 *
 * @memberof ErrorEnum
 * @export TokenError
 * @type {TokenError}
 */
Object.defineProperty(exports, 'TokenError', {
  value: require('../classes/errors/TokenError').TokenError,
  enumerable: !0,
});

/**
 * ConnectionError - An Error related to getting banned users from Discord Bans.
 *
 * @memberof ErrorEnum
 * @export ConnectionError
 * @type {ConnectionError}
 */
Object.defineProperty(exports, 'ConnectionError', {
  value: require('../classes/errors/ConnectionError').ConnectionError,
  enumerable: !0,
});

/**
 * TimerError - An Error related to setting banlist auto-update timer.
 *
 * @memberof ErrorEnum
 * @export TimerError
 * @type {TimerError}
 */
Object.defineProperty(exports, 'TimerError', {
  value: require('../classes/errors/TimerError').TimerError,
  enumerable: !0,
});
