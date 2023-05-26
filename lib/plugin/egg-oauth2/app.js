'use strict';

const path = require('path');
const OAuth2Server = require('./lib/server');

module.exports = app => {
    app.coreLogger.info('[egg-oauth2] egg-oauth2 begin start');
    const start = Date.now();

    const config = app.config.oAuth2Server; // extendedGrantTypes
    // const model = app.loader.loadFile(path.join(app.config.baseDir, 'app/extend/oauth.js')) ||
    //     app.loader.loadFile(path.join(app.config.baseDir, 'app/extend/oauth.ts'));
    let extendedModel = {
        password: app.loader.loadFile(path.join(app.config.baseDir, 'app/extend/oauth.js')) ||
            app.loader.loadFile(path.join(app.config.baseDir, 'app/extend/oauth.ts')),
    };

    for (const key in config.extendedGrantTypes) {
        if (Object.hasOwnProperty.call(config.extendedGrantTypes, key)) {
            const value = config.extendedGrantTypes[key];
            let pathFile = path.join(app.config.baseDir, value);
            extendedModel[key] = app.loader.loadFile(pathFile);
            config.extendedGrantTypes[key] = require(`./grant_types/${key}-grant-type`);
        }
    }

    if (Object.keys(extendedModel).length < 1) {
        app.coreLogger.error('[egg-oauth2] not find app/extend/oauth.js, egg-oauth2 start fail');
        return;
    }
    try {
        app.oAuth2Server = new OAuth2Server(config, extendedModel);
    } catch (e) {
        app.coreLogger.error('[egg-oauth2] start fail, %s', e);
        return;
    }
    app.coreLogger.info('[egg-oauth2] egg-oauth2 started use %d ms', Date.now() - start);
};