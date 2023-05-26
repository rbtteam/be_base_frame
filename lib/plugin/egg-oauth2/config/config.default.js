'use strict';


module.exports = config => {
    const exports = {};
    /**
     * @see https://www.npmjs.com/package/oauth2-server
     */
    exports.oAuth2Server = {
        debug: config.env === 'local',
        grants: ['password'],
    };

    exports.wxServer = {
        domain: 'https://api.weixin.qq.com/'
    };
    exports.enums = {
        clientType: {
            WEB: 1, // web/h5
            APP: 2, // app
            WXAPP: 3, // 微信小程序
            WXACCOUNT: 4, // 微信公众号
        },
    };
    return exports;
};