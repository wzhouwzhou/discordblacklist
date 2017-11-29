'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Checks if a timer is a valid whole number of positive minutes.
 *
 * @memberof Constants
 * @method isValidTimer
 * @param  {*}   minutes - Possibility for update interval in minutes.
 * @return {boolean} Whether the minutes is usable in the Blacklist autoupdate timer.
 */

exports.isValidTimer = minutes => +minutes === minutes && minutes === (minutes | 0) && minutes > 0;
