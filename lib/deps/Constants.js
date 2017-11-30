'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Package constants
 *
 * @module Constants
 * @type {Object}
 */

/**
 * The API endpoint.
 *
 * @memberof Constants
 * @export API
 * @type {string}
 */

exports.API = 'https://bans.discordlist.net/api';


const pkg = require('../../package.json');

/**
 * The version of the package.
 * @memberof Constants
 * @export VERSION
 * @type {string}
 */

exports.VERSION = pkg.version;

/**
 * The repository URL of the package.
 * @memberof Constants
 * @export REPO
 * @type {string}
 */

exports.REPO = pkg.github;


/**
 * Regular expression to strip away HTML from prooflinks in Api response from DiscordBans.
 *
 * @memberof Constants
 * @readonly
 * @export PROOFPADREG
 * @type {RegExp}
 */

Object.defineProperty(exports, 'PROOFPADREG', { value: /(^<a\s+href=")|(">Proof<\/a>$)/gi });


/**
 * A Constant that dictates the default timer type of a Blacklist's autoupdate.
 * @memberof Constants
 * @export TIMERS_DEFAULT
 * @type {string}
 */

exports.TIMERS_DEFAULT = 'timers_default';

/**
 * The default refresh time for a Blacklist's autoupdate.
 * @memberof Constants
 * @export TIMERS_DEFAULT_MINUTES
 * @type {number}
 */

exports.TIMERS_DEFAULT_MINUTES = 120;
