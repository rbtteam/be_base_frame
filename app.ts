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
        // 配置文件即将加载，这是最后动态修改配置的时机
        // 加载enums缓存
        this.app.enums = enums;
        this.app.Joi = Joi;
    }

    configDidLoad() {
        // 配置文件加载完成

    }

    async didLoad() {
        // 文件加载完成
    }

    async willReady() {
        // 插件启动完毕
        // // 加载请求参数
        // this.app.loader.loadToApp(path.join(this.app.config.baseDir, 'app/controller/parameters'), 'parameters');
        // let parameters = {};
        // for (const key in this.app.parameters) {
        //     if (Object.hasOwnProperty.call(this.app.parameters, key)) {
        //         for (const m in this.app.parameters[key]) {
        //             if (Object.hasOwnProperty.call(this.app.parameters[key], m)) {
        //                 const element = this.app.parameters[key][m];
        //                 if (!parameters[m]) {
        //                     parameters[m] = element;
        //                 } else {
        //                     parameters[m] = {
        //                         ...parameters[m],
        //                         ...element,
        //                     };

        //                 }
        //                 if (['get', 'put', 'delete', 'post'].findIndex(e => e === m) === -1) {
        //                     for (const apiName in element) {
        //                         if (Object.hasOwnProperty.call(element, apiName)) {
        //                             parameters[apiName] = element[apiName];
        //                         }
        //                     }

        //                 }

        //             }
        //         }
        //     }
        // }
        // this.app.parameters = parameters;

        // // 加载所有的校验规则
        // this.app.loader.loadToApp(path.join(this.app.config.baseDir, 'app/validate'), 'validate');
    }

    async didReady() {
        // worker 准备就绪
        // don't need to block the app boot.
    }

    async serverDidReady() {
        // 应用启动完成
        // if (this.app.config.env === 'local' || this.app.config.env === 'unittest') {
        //     await this.app.model.sync({ force: true });
        // }
    }

    async beforeClose() {
        // 应用即将关闭.
        console.log("应用即将关闭");
    }
}

module.exports = AppBootHook;