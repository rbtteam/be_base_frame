/* eslint valid-jsdoc: "off" */

'use strict';

import { EggAppConfig, PowerPartial } from 'egg';
export default (appInfo: EggAppConfig) => {

    const config = {} as PowerPartial<EggAppConfig>;

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1626056319132_6771';

    config.redis = {
        clients: {
            common: {
                port: 6379, // Redis port
                host: '123.57.213.151', // Redis host
                password: 'redis_@rbt2021',
                db: 1,
            },
        },
    };

    // 微信API相关配置
    config.wxapi = {
        component: { // 第三方平台信息
            appId: 'wxf6f5828ccd6b66e4',
            appSecret: 'eea6ad6177b9d6b8dde44d6b3b7b0734',
        },
        message: {
            encodingAESKey: 'u4kfq0CwN0ptqMdWEwODKxevf8bDvCSBhN8iQrPeFae',
            verifyToken: 'rbt1qaz2wsx3edc',
        },
    };

    config.sequelize = {
        dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
        database: 'rbteshop',
        host: '123.57.213.151',
        port: 3306,
        username: 'rbteshop',
        password: '2ze63zh878rhac4mwddq',
        timezone: '+08:00',
        delegate: 'model',
        baseDir: 'model',
        pool: {
            max: 2000,
            min: 0,
            idle: 200000,
            acquire: 1000000,
        },
        define: {
            freezeTableName: true,
            underscored: false,
        },
    };

    // add your user config here
    const userConfig = {
        // myAppName: 'egg',
        tokenConfig:{
            openVerfiyToken: false,
        },
        fileDomin: 'https://gpglobal.bjrbt.cn',
        dwzDomin: 'https://www.bjrbt.cn/#/dwz?',
        gp_c_stu: 'https://eshopstu.bjrbt.cn',
        domain: 'https://gpglobal.bjrbt.cn',
        // 建工
        JGDomainApi: 'https://xysd.cabplink.com/api',
        JGAppCode: "xysd",
        ectroute: 'http://ectroute.bg-online.cn',//易诚通
        paymentNotification: {
            payNotification: "https://gpglobal.bjrbt.cn/eshopC/payment/wechatPayNotification",
            refundPayNotification: "https://gpglobal.bjrbt.cn/eshopC/payment/wechatRefundPayNotification",
        },
    };
    // config.logger = {
    //     level: 'ERROR',
    //   };

    return {
        ...(config as {}),
        ...userConfig,
    };
};