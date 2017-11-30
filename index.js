'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Discordblacklist - The Featured Nodejs package that facilitates getting banned Discord users from DiscordBans.
 *
 * @author William Zhou
 * @type {Object}
 * @module discordblacklist
 */

// ============================================================================= //
// discordblacklist by William Zhou (@wzhouwzhou/https://github.com/wzhouwzhou). //
// Code is Licensed under GNU AFFERO GENERAL PUBLIC LICENSE 3.0                  //
// ============================================================================= //

/**
 * The Blacklist Class - The main hub for interacting with the DiscordBans API.
 *
 * @export Blacklist
 * @type {Blacklist}
 */

exports.Blacklist = require('./lib/classes/Blacklist.discord').Blacklist;

/**
 * An Object containing the three custom errors in case you would like to check for them.
 * See {@link module-ErrorEnum ErrorEnum} for more information.
 *
 * @export Errors
 * @type {Object}
 */

exports.Errors = require('./lib/deps/ErrorEnum');

/**
 * The BanStore Class - In case you would like to create BanStores yourself.
 * See {@link BanStore} for more information.
 *
 * @export BanStore
 * @type {BanStore}
 */

exports.BanStore = require('./lib/classes/BanStore').BanStore;

/**
 * Various Package Constants. See {@link module-Constants Constants}
 *
 * @export Constants
 * @type {Object}
 */

exports.Constants = require('./lib/deps/Constants');
