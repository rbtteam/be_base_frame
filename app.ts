'use strict';
import * as  path from 'path';
import enums from './app/extend/enums';
import Joi = require('joi');
import { Application } from 'egg'
class AppBootHook {
    app = {} as Application;
    constructor(app) {
        this.app = app;

    }

    configWillLoad() {
        // Ready to call configDidLoad,
        // Config, plugin files are referred,
        // this is the last chance to modify the config.
        // 加载enums缓存
        this.app.enums = enums;
        this.app.Joi = Joi;
    }

    configDidLoad() {
        // Config, plugin files have been loaded.

    }

    async didLoad() {
        // All files have loaded, start plugin here.
    }

    async willReady() {
        // All plugins have started, can do some thing before app ready
        // 加载请求参数
        this.app.loader.loadToApp(path.join(this.app.config.baseDir, 'app/controller/parameters'), 'parameters');
        let parameters = {};
        for (const key in this.app.parameters) {
            if (Object.hasOwnProperty.call(this.app.parameters, key)) {
                for (const m in this.app.parameters[key]) {
                    if (Object.hasOwnProperty.call(this.app.parameters[key], m)) {
                        const element = this.app.parameters[key][m];
                        if (!parameters[m]) {
                            parameters[m] = element;
                        } else {
                            parameters[m] = {
                                ...parameters[m],
                                ...element,
                            };

                        }
                        if (['get', 'put', 'delete', 'post'].findIndex(e => e === m) === -1) {
                            for (const apiName in element) {
                                if (Object.hasOwnProperty.call(element, apiName)) {
                                    parameters[apiName] = element[apiName];
                                }
                            }

                        }

                    }
                }
            }
        }
        this.app.parameters = parameters;

        // 加载所有的校验规则
        this.app.loader.loadToApp(path.join(this.app.config.baseDir, 'app/validate'), 'validate');
    }

    async didReady() {
        // Worker is ready, can do some things
        // don't need to block the app boot.
    }

    async serverDidReady() {
        // Server is listening.
        // if (this.app.config.env === 'local' || this.app.config.env === 'unittest') {
        //     await this.app.model.sync({ force: true });
        // }
    }

    async beforeClose() {
        // Do some thing before app close.
    }
}

module.exports = AppBootHook;