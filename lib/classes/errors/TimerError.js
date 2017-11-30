'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

/**
 * TimerError extends RangeError
 * An Error related to setting banlist auto-update timer.
 * Notable errors include `No minutes specified` and `Invalid minutes specified of {x}`
 *
 * @type {TimerError}
 */

const TimerError = class TimerError extends RangeError {
  /**
   * Constructor - Sets the name of this TimerError
   *
   * @constructor
   * @param  {*}  message  The message of the Error.
   */

  constructor(message) {
    super(message);
    this.name = 'TimerError';
  }
};

exports.TimerError = TimerError;
