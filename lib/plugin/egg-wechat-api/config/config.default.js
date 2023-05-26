'use strict';

/**
 * 微信公众平台的相关配置
 * @member Config Egg配置
 * @property {String}  appId - 应用号
 * @property {number}  appSecret  - 应用密钥
 */
exports.mp = {
    component: {
        appId: '',
        appSecret: '',
    },
    message: {
        encodingAESKey: '',
        verifyToken: '',
    },
};