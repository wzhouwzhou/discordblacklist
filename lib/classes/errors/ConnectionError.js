'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

/**
 * ConnectionError extends RangeError
 * An Error related to setting banlist auto-update timer.
 * Notable errors includ `Status {x}`, `Missing body`, and `No data received`.
 *
 * @type {ConnectionError}
 */

const ConnectionError = class ConnectionError extends Error {
  /**
   * Constructor - Sets the name of this ConnectionError
   *
   * @constructor
   * @param  {*}  message  The message of the Error.
   */

  constructor(message) {
    super(message);
    this.name = 'ConnectionError';
  }
};

exports.ConnectionError = ConnectionError;
