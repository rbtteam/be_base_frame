'use strict';

/**
 * Module dependencies.
 */

var AbstractGrantType = require('oauth2-server/lib/grant-types/abstract-grant-type');
var InvalidArgumentError = require('oauth2-server/lib/errors/invalid-argument-error');
var InvalidGrantError = require('oauth2-server/lib/errors/invalid-grant-error');
var InvalidRequestError = require('oauth2-server/lib/errors/invalid-request-error');
// var InvalidClientError = require('oauth2-server/lib/errors/invalid-client-error');
var Promise = require('bluebird');
var promisify = require('promisify-any').use(Promise);
var is = require('oauth2-server/lib/validator/is');
var util = require('util');

/**
 * Constructor.
 */

function WxAccountGrantType(options) {
    options = options || {};

    if (!options.model) {
        throw new InvalidArgumentError('Missing parameter: `model`');
    }

    if (!options.model.getUser) {
        throw new InvalidArgumentError('Invalid argument: model does not implement `getUser()`');
    }

    if (!options.model.saveToken) {
        throw new InvalidArgumentError('Invalid argument: model does not implement `saveToken()`');
    }

    AbstractGrantType.call(this, options);
}

/**
 * Inherit prototype.
 */

util.inherits(WxAccountGrantType, AbstractGrantType);

/**
 * Retrieve the user from the model using a username/password combination.
 *
 * @see https://tools.ietf.org/html/rfc6749#section-4.3.2
 */

WxAccountGrantType.prototype.handle = function(request, client) {
    if (!request) {
        throw new InvalidArgumentError('Missing parameter: `request`');
    }

    if (!client) {
        throw new InvalidArgumentError('Missing parameter: `client`');
    }

    var scope = this.getScope(request);

    return Promise.bind(this)
        .then(function() {
            return this.getUser(request, client);
        })
        .then(function(user) {
            return this.saveToken(user, client, scope);
        });
};

/**
 * Get user using a username/password combination.
 */

WxAccountGrantType.prototype.getUser = async function(request, client) {
    if (!request.body.code) {
        throw new InvalidRequestError('Missing parameter: `code`');
    }

    if (!is.uchar(request.body.code)) {
        throw new InvalidRequestError('Invalid parameter: `code`');
    }

    return promisify(this.model.getUser, 2).call(this.model, request.body.code, client)
        // return promisify(this.model.getUser, 2).call(this.model, request.body.username, request.body.password)
        .then(function(user) {
            if (!user) {
                throw new InvalidGrantError('Invalid grant: user credentials are invalid');
            }

            return user;
        });
};

/**
 * Save token.
 */

WxAccountGrantType.prototype.saveToken = function(user, client, scope) {
    var fns = [
        this.validateScope(user, client, scope),
        this.generateAccessToken(client, user, scope),
        this.generateRefreshToken(client, user, scope),
        this.getAccessTokenExpiresAt(),
        this.getRefreshTokenExpiresAt()
    ];

    return Promise.all(fns)
        .bind(this)
        .spread(function(scope, accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt) {
            var token = {
                accessToken: accessToken,
                accessTokenExpiresAt: accessTokenExpiresAt,
                refreshToken: refreshToken,
                refreshTokenExpiresAt: refreshTokenExpiresAt,
                scope: scope
            };

            return promisify(this.model.saveToken, 3).call(this.model, token, client, user);
        });
};

/**
 * Export constructor.
 */

module.exports = WxAccountGrantType;