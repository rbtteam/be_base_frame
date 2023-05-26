/* eslint valid-jsdoc: "off" */

'use strict';

import { EggAppConfig, PowerPartial } from 'egg';
export default (appInfo: EggAppConfig): any => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = {} as PowerPartial<EggAppConfig>;

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1626056319132_6771';

    config.redis = {
        clients: {
            common: {
                port: 6001, // Redis port
                host: '182.92.119.234', // Redis host
                password: '1qaz@wsx',
                db: 10,
            },
        },
    };

    // 微信API相关配置
    config.wxapi = {
        component: { // 第三方平台信息
            appId: 'wx19a325c6579edff9',
            appSecret: 'f3ead761ff9e36d73256702f40c187b3',
        },
        message: {
            encodingAESKey: 'u4kfq0CwN0ptqMdWEwODKxevf8bDvCSBhN8iQrPeFae',
            verifyToken: 'rbt1qaz2wsx3edc',
        },
    };

    config.sequelize = {
        datasources: [
            {
              dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
              database: 'test',
              host: '182.92.119.234',
              port: 3306,
              username: 'rbteshop',
              password: '1qaz2wsx123',
              timezone: '+08:00',
              delegate: 'model',
              baseDir: 'model',
              pool: {
                max: 2000,
                min: 0,
                idle: 200000,
   //             acquire: 1000000,
              },
              define: {
                freezeTableName: true,
                underscored: false,
                timestamps: false, // 为模型添加createdAt和updatedAt字段
              }
            }
        ]
    };
    // 钉钉
    config.dingtalk = {
        corpid: '',
        corpsecret: '',
        host: '',
        enableContextLogger: '',
    };
    config.security = {
        xframe: {
          value: 'SAMEORIGIN',
        },
    };
    // add your user config here
    const userConfig = {
        // myAppName: 'egg',
        tokenConfig:{
            openVerfiyToken: false,
        },
        fileDomin: 'http://tgpglobal.bjrbt.cn',
        dwzDomin: 'http://twww.bjrbt.cn/#/dwz?',
        gp_c_stu: 'https://teshopstu.bjrbt.cn',
        domain: 'https://tgpglobal.bjrbt.cn',
        // 建工
        JGDomainApi: 'https://xysd.cabplink.com/api',
        JGAppCode: "xysd",
        ectroute: 'https://route.shuyongwen.com.cn',
        paymentNotification: {
            payNotification: "https://tgpglobal.bjrbt.cn/eshopC/payment/wechatPayNotification",
            refundPayNotification: "https://tgpglobal.bjrbt.cn/eshopC/payment/wechatRefundPayNotification",
        },
    };

    
    return {
        ...(config as {}),
        ...userConfig,
    };
};