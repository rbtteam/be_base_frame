'use strict';

const AuthServer = require('oauth2-server');
const Request = require('oauth2-server').Request;
const Response = require('oauth2-server').Response;
const InvalidArgumentError = require('oauth2-server/lib/errors/invalid-argument-error');
const UnauthorizedRequestError = require('oauth2-server/lib/errors/unauthorized-request-error');
const ServerError = require('oauth2-server/lib/errors/server-error');

/**
 * replace response.
 */

function replaceResponse(res) {
    // copy for response.headers.hasOwnProperty is undefined case
    // https://github.com/oauthjs/node-oauth2-server/pull/486
    const newResponse = {
        headers: {},
    };
    for (const property in res) {
        if (property !== 'headers') {
            newResponse[property] = res[property];
        }
    }
    for (const field in res.headers) {
        newResponse.headers[field] = res.headers[field];
    }
    newResponse.header = newResponse.headers;
    return newResponse;
}

/**
 * Handle response.
 */

function handleResponse(ctx, response) {
    ctx.body = {
        code: 0,
        data: response.body,
    };
    ctx.status = response.status;
    ctx.set(response.headers);
}

/**
 * Handle error.
 */

function handleError(ctx, e, response) {
    if (response) {
        ctx.set(response.headers);
    }

    if (e instanceof UnauthorizedRequestError) {
        ctx.status = e.code;
    } else {
        ctx.body = {
            error: e.name,
            error_description: (e instanceof ServerError && ctx.app.config.env === 'prod') ? 'Server Error' : e.message,
        };
        ctx.status = e.code;
    }
    return ctx.app.emit('error', e, ctx);
}

class OAuth2 {
    constructor(config, model) {
        if (!model) {
            throw new InvalidArgumentError('Missing parameter: `model`');
        }
        this.config = config;
        this.model = model;
        this.grantType = 'password';
        this.authServer = {};
    }

    get server() {
        const { config, model, ctx, grantType } = this;

        // if (!Object.keys(this.authServer).length) {
        //     if (!grantType) {
        //         throw new InvalidArgumentError('Missing parameter: `grant`');
        //     }
        //     for (let i = 0; i < config.grants.length; i++) {
        //         const grant = config.grants[i];
        //         const currentModel = new model[grant](ctx);
        //         this.authServer[grant] = new AuthServer(Object.assign(config, { model: currentModel }));
        //     }
        // }

        const currentModel = new model[grantType](ctx);
        this.authServer = new AuthServer(Object.assign(config, { model: currentModel }));

        return this.authServer;
    }

    async execute(handle, ctx, options) {
        let result = null;
        this.ctx = ctx;
        const request = new Request(ctx.request);
        const response = new Response(replaceResponse(ctx.response));
        try {
            result = await this.server[handle](request, response, options);
            handleResponse(ctx, response);
        } catch (e) {
            if (this.config.errorHandler) {
                this.config.errorHandler(ctx, e, response);
            } else {
                handleError(ctx, e, response);
            }
        }
        return result;
    }

    token(options) {
        return async(ctx, next) => {
            this.grantType = ctx.request.body.grant_type;
            const token = await this.execute('token', ctx, options);
            ctx.state.oauth = {
                token,
            };
            if (token) {
                await next();
            }
        };
    }

    authenticate(options) {
        return async(ctx, next) => {
            this.grantType = options.grantType || 'password';
            const token = await this.execute('authenticate', ctx, options);
            ctx.state.oauth = {
                token,
            };
            if (token) {
                await next();
            }
        };
    }

    authorize(options) {
        options = options || {};
        const self = this;
        return async(ctx, next) => {
            const opts = Object.assign({}, {
                authenticateHandler: {
                    async handle(req) {
                        const { username, password } = req.body;
                        const user = await self.server.options.model.getUser(
                            username,
                            password
                        );
                        return user;
                    },
                },
            }, options);
            const code = await this.execute('authorize', ctx, opts);
            ctx.state.oauth = {
                code,
            };
            if (code) {
                await next();
            }
        };
    }
}

module.exports = OAuth2;