'use strict';
import * as  path from 'path';
import { EggPlugin } from 'egg';
const plugin: EggPlugin = {
    //阿里云性能监控
    alinode: {
        enable: true,
        package: 'egg-alinode',
    },
    static: true,
    oAuth2Server: {
        enable: true,
        path: path.join(__dirname, '../lib/plugin/egg-oauth2'),
    },
    redis: {
        enable: true,
        package: 'egg-redis',
    },
    sequelize: {
        enable: true,
        package: 'egg-sequelize'
    },
    validate: {
        enable: true,
        package: 'egg-validate',
    },
    cors: {
        enable: true,
        package: 'egg-cors',
    },
    wxapi: {
        enable: true,
        path: path.join(__dirname, '../lib/plugin/egg-wechat-api'),
    },
    dingtalk:{
        enable: true,
        package: 'egg-dingtalk',
    },
    security:{
        enable: true,
        package: 'egg-security',
    },

    
};
export default plugin;