/* eslint valid-jsdoc: "off" */

'use strict';
import { EggAppConfig, PowerPartial } from 'egg';
export default (appInfo: EggAppConfig): any => {

    const config = {} as PowerPartial<EggAppConfig>;

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1626056319132_6771';

    config.cluster = {
        listen: {
            port: 8002,
        },
    };

    // 跨域配置
    config.cors = {
        allowMethods: 'GET,POST,PUT,DELETE,OPTIONS',
        origin: '*',
        credentials: true,
    };

    config.security = {
        csrf: {
            // ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
            enable: false,
        },
        domainWhiteList: [
        ],
    };

    config.session = {
        key: 'RBT_SESS',
        maxAge: 24 * 3600 * 1000, // 1 天
        httpOnly: true,
        encrypt: true,
    };

    config.alinode = {
        // 从 `Node.js 性能平台` 获取对应的接入参数
        appid: '91729',
        secret: 'f741b3505c47a8001ae3993d0d799c1097a232ec',
      };

    // 静态目录配置
    config.uploadDir = 'app/public/upload';

    config.multipart = {
        fileSize: '5mb',
        mode: 'stream',
        whitelist: [
            '',
            '.jpg', '.jpeg', // image/jpeg
            '.png', // image/png, image/x-png
            '.gif', // image/gif
            '.bmp', // image/bmp
            '.wbmp', // image/vnd.wap.wbmp
            '.webp',
            '.tif',
            '.psd',
            // pdf word
            '.pdf',
            '.docx', '.doc',
            // text
            '.svg',
            '.js', '.jsx',
            '.json',
            '.css', '.less',
            '.html', '.htm',
            '.xml',
            // tar
            '.zip',
            '.gz', '.tgz', '.gzip',
            // video
            '.mp3',
            '.mp4',
            '.avi',
            '.xlsx',
            '.xls',
            '.ppt',
            '.pptx',
            //.p12
            '.p12'
        ]
    };

    // add your middleware config here
    config.middleware = [];

    // 异常错误处理
    config.onerror = {
        all(err, ctx) {
            // 在此处定义针对所有响应类型的错误处理方法
            // 注意，定义了 config.all 之后，其他错误处理方法不会再生效
            ctx.logger.error(`${ctx.paramsIndex} ${err}`);
            ctx.body = { code: 500, msg: err.message || '内部错误' };
            ctx.status = 500;
        },
        html(err, ctx) {
            // html hander
            ctx.logger.error(err);
            ctx.body = '<h3>error</h3>';
            ctx.status = 500;
        },
        json(err, ctx) {
            // json hander
            ctx.logger.error(err);
            ctx.body = { msg: 'error' };
            ctx.status = 500;
        },
        jsonp(err, ctx) {
            ctx.logger.error(err);
            // 一般来说，不需要特殊针对 jsonp 进行错误定义，jsonp 的错误处理会自动调用 json 错误处理，并包装成 jsonp 的响应格式
        },
    };

    config.bodyParser = {
        jsonLimit: '10mb',
        formLimit: '10mb',
        enable: true,
        encoding: 'utf8',
        strict: true,
        enableTypes: ['json', 'form', 'text'],
        extendTypes: {
            text: ['text/xml', 'application/xml'],
        },
    };

    config.oAuth2Server = {
        debug: config.env === 'local',
        grants: ['password', 'wx-account', 'wx-app'],
        extendedGrantTypes: {
            'wx-account': 'app/extend/wxAccountOauth',
            'wx-app': 'app/extend/wxAccountOauth',
            'password': 'app/extend/oauth',
        },
        accessTokenLifetime: 60 * 60 * 24 * 7,
        errorHandler(ctx, e) {
            // 在此处定义针对所有响应类型的错误处理方法
            // 注意，定义了 config.all 之后，其他错误处理方法不会再生效
            ctx.body = { code: 1000, msg: e.message || '内部错误' };
            ctx.status = 503;
        },
    };


    // add your user config here
    const userConfig = {
        tokenConfig:{
            openVerfiyToken: true,
            // 路由白名单，不需要验证token
            urlWhiteList: [
                '/qywechat/demoA/info',
                '/account/auth/token',
                '/account/weChat/pre-auth',
                '/account/sup/register',
                '/account/auth/info/:id',
                '/res/upload',
                '/res/uploadAI',
                '/api/wx-event/:id',
                '/eshopCenter/order/aca',
                '/account/register/user',
                '/account/my/addCouponList',
                '/eshopCenter/project/shopCouponProjectCoupon',
                '/eshopCenter/dwz/key',
                '/account/user/smscode'
            ]
        },
        clientConfig: {
            clientPrefix: 'rbt',
            clientLength: 16,
            secretLength: 32,
            clients: [{
                Name: '供货商平台',
                ClientID: 'rbtvvkna4zh3bt3e',
                ClientSecret: 'd1fcasucglyg4qn6er3pfe31zzyoswsj',
                Type: 1,
                grants: ['password'],
            }, {
                Name: 'B端',
                ClientID: 'rbtvv2na3zh3bt3d',
                ClientSecret: 'd1fc1sucglyg4qe6er3pfe31ziyosw3j',
                Type: 1,
                grants: ['password'],
            }, {
                Name: 'C端',
                ClientID: 'rbtvv3na4zh5bt6d',
                ClientSecret: 'd1fc2sucglyg4qe6er3pfe31ziyosw3j',
                Type: 1,
                grants: ['password'],
            }],
        },
        lev:4, // 资源响应级别  lev <=4 可以被访问
        apiConfig:[
            {
              name: '/qywechat/demoA/info',
              lev:1,  // 重要层级   1、核心模块  2、次要模块  3、边缘模块 4、暂停服务    资源不足时限流使用
              cache:false,  //是否启用缓存
              cacheTime:1000, // 缓存有效时长秒
              role:[1],  //角色
              auth:0,      // 0 全部可以访问 1、角色验证 2、角色+权限验证
            }
        ],
        // 服务商平台
        payment: {
            appid: 'wxa68c6dba7aeebbe6',
            mchid: '1613063903',
            partnerKey: 'zQ3cD1dS0fB0nH1gB3aA4gB0dA7aI0iB',//v1: zQ3cD1dS0fB0nH1gB3aA4gB0dA7aI0iB           v3: Z3Ok9V0PRqf4cWj0n8oyO7b0k2FIUHnQ
        },

    };


    return {
        ...(config as {}),
        ...userConfig,
    };
};