'use strict';

const Service = require('egg').Service;
const request = require('request');

const tokenUri = 'https://api.weixin.qq.com/cgi-bin/token'; // 换取统一令牌
const ticketUri = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket'; // Web端临时票据
const templateUri = 'https://api.weixin.qq.com/cgi-bin/message/template/send'; // 推送模板消息
const usersUri = 'https://api.weixin.qq.com/cgi-bin/user/get'; // 获取用户信息
const userInfoBatch = 'https://api.weixin.qq.com/cgi-bin/user/info/batchget'; // 批量获取用户信息
const authUri = 'https://api.weixin.qq.com/sns/oauth2/access_token'; // 微信网页授权
const payUri = 'https://api.mch.weixin.qq.com/pay/unifiedorder'; // 微信统一下单
const customsend = 'https://api.weixin.qq.com/cgi-bin/message/custom/send'; //发送客服消息
const qrcode = 'https://api.weixin.qq.com/cgi-bin/qrcode/create';  //生成带参数的二维码
const upMedia = 'https://api.weixin.qq.com/cgi-bin/media/upload';  //上传素材
const userInfo = 'https://api.weixin.qq.com/cgi-bin/user/info'; //获取用户基本信息
const addGuideUri = 'https://api.weixin.qq.com/cgi-bin/guide/addguideacct';//添加顾问
const delGuideUri = 'https://api.weixin.qq.com/cgi-bin/guide/delguideacct';//移除顾问
const setGuideConfig = 'https://api.weixin.qq.com/cgi-bin/guide/setguideconfig';//添加、修改自动回复
const guideCreateQRCode = 'https://api.weixin.qq.com/cgi-bin/guide/guidecreateqrcode';//生成顾问二维码
const create = 'https://api.weixin.qq.com/cgi-bin/menu/create';//生成自定义菜单
const getCurrentSelfmenuInfo = 'https://api.weixin.qq.com/cgi-bin/get_current_selfmenu_info';//查询自定义菜单
const deleteSelfmenuInfo = 'https://api.weixin.qq.com/cgi-bin/menu/delete';//删除自定义二维码
const addGuideBuyerRelation = 'https://api.weixin.qq.com/cgi-bin/guide/addguidebuyerrelation';//为顾问分配客户

const wxacodeunlimit = 'https://api.weixin.qq.com/wxa/getwxacodeunlimit'; //获取小程序码 调用本 API 可以获取小程序码，适用于需要的码数量极多的业务场景。通过该接口生成的小程序码，永久有效，数量暂无限制。 使用过程中如遇到问题，可在开放平台服务商专区发帖交流。

const jsonType = {
    dataType: 'json',
};

class WCSService extends Service {
    /**
     * 获取Token
     * @return {String} 令牌
     * @see https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183
     */
    async getToken() {
        const {
            appId,
            appSecret,
        } = this.app.config.mp;
        const url = `${tokenUri}?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
        const res = await this.ctx.curl(url, jsonType);
        return res.data;
    }

    /**
     * 获取Ticket
     * @param {String} token 令牌
     * @return {Object} 票据信息
     * @see https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115
     */
    async getTicket(token) {
        const url = `${ticketUri}?access_token=${token}&type=jsapi`;
        const res = await this.ctx.curl(url, jsonType);
        return res.data;
    }

    /**
     * 获取权限验证配置
     * @param {String} url 调用JSAPI的网址
     * @return {Object} JSSDK初始化配置
     * @see https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115
     */
    async getConfig(appId, ticket, url) {
        const params = this._createConfigSign(ticket, url);
        params.appId = appId;
        return params;
    }

    /**
     * 微信网页授权
     * @param {String} code 临时授权码
     * @return {Object} 微信返回的授权信息
     * @see https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842
     */
    async auth(code) {
        const {
            appId,
            appSecret,
        } = this.app.config.mp;
        const url = `${authUri}?grant_type=authorization_code&appid=${appId}&secret=${appSecret}&code=${code}`;
        const res = await this.ctx.curl(url, jsonType);
        return res.data;
    }

    /**
     * 发送模板消息
     * @param {String} accessToken accessToken
     * @param {Object} data 模板消息数据
     * @return {Object} 微信返回的推送结果
     * @see https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1433751277
     */
    async sendTemplateMsg(accessToken, data) {
        const url = `${templateUri}?access_token=${accessToken}`;
        const res = await this.ctx.curl(url, {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
        });
        return res.data;
    }
    // 发送客服消息
    async sendCustomMsg(accessToken, data) {
        const url = `${customsend}?access_token=${accessToken}`;
        const res = await this.ctx.curl(url, {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
        });
        return res.data;
    }
    // 获取用户信息
    async getUserInfo(accessToken, openid) {
        const url = `${userInfo}?access_token=${accessToken}&openid=${openid}&lang=zh_CN`;
        const res = await this.ctx.curl(url, jsonType);
        return res.data;
    }
    /**
     * 生成带参数的二维码
     * action_name 类型
     * scene_str 场景值 场景值ID（字符串形式的ID），字符串类型，长度限制为1到64
     */
    async qrcodeStr(action_name, scene_str, accessToken) {
        let bodyInfo = {
        };

        if (action_name === 'QR_LIMIT_STR_SCENE') { //永久
            bodyInfo = {
                action_name: 'QR_LIMIT_STR_SCENE',
                action_info: {
                    'scene': {
                        'scene_str': scene_str,
                    }
                },
            };
        } else if (action_name === 'QR_STR_SCENE') { // 零时
            bodyInfo = {
                action_name: 'QR_LIMIT_STR_SCENE',
                action_info: {
                    'scene': {
                        'scene_str': scene_str,
                    }
                },
                expire_seconds: 2592000,
            };
        }

        const urlResult = await this.ctx.curl(`${qrcode}?access_token=${accessToken}`, {
            method: 'POST',
            data: bodyInfo,
            headers: {
                'Content-Type': 'application/json',
            },
            dataType: 'json',
            timeout: 6000,
        });
        if (urlResult.status === 200) {
            return urlResult.data.url;
        } else {
            throw Error('获取二维码失败');
        }

    }
    // 生成带参数的二维码  scene_id
    async qrcode(action_name, scene_id, accessToken) {
        let bodyInfo = {
        };

        if (action_name === 'QR_LIMIT_SCENE') { //永久
            bodyInfo = {
                action_name: 'QR_LIMIT_SCENE',
                action_info: {
                    'scene': {
                        'scene_id': scene_id,
                    }
                },
            };
        } else if (action_name === 'QR_SCENE') { // 零时
            bodyInfo = {
                action_name: 'QR_SCENE',
                action_info: {
                    'scene': {
                        'scene_id': scene_id,
                    }
                },
                expire_seconds: 2592000,
            };
        }

        const urlResult = await this.ctx.curl(`${qrcode}?access_token=${accessToken}`, {
            method: 'POST',
            data: bodyInfo,
            headers: {
                'Content-Type': 'application/json',
            },
            dataType: 'json',
            timeout: 6000,
        });
        if (urlResult.status === 200) {
            return urlResult.data.url;
        } else {
            throw Error('获取二维码失败');
        }

    }


    // 获取素材
    async getMediaid(buffer, filename, accessToken) {

        let api = `${upMedia}?access_token=${accessToken}&type=image`;
        return new Promise((resolve, reject) => {
            request.post({
                url: api,
                formData: {
                    buffer: {
                        value: buffer,
                        options: {
                            filename: filename,
                            contentType: 'image/png'
                        }
                    }
                }
            }, function optionalCallback(err, httpResponse, body) {
                if (err) {
                    reject(err);
                }
                resolve(JSON.parse(body));
            });
        });
    }

    /**
     * 获取用户列表
     * @param {String} accessToken accessToken
     * @return {Object} 用户列表
     * @see  https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140840
     */
    async getUserList(accessToken) {
        const url = `${usersUri}?access_token=${accessToken}`;
        const res = await this.ctx.curl(url, jsonType);
        const openids = res.data.data.openid;
        return openids;
    }

    /**
     * 批量获取用户信息
     * @param {String} accessToken accessToken
     * @param {Array} openids 用户数据
     * @return {Object} 批量用户信息
     * @see https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140839
     */
    async getBatchUserInfo(accessToken, openids) {
        const url = `${userInfoBatch}?access_token=${accessToken}`;
        const res = await this.ctx.curl(url, {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(openids),
        });
        return res.data;
    }

    /**
     * 统一下单
     * @param {String} openid 开放平台编号
     * @param {Object} order 订单数据
     * @return {Object} 用于JSSDK调用支付接口
     * @see https://api.mch.weixin.qq.com/pay/unifiedorder
     */
    async createOrder(openid, order) {
        const {
            ctx,
        } = this;
        const signedParams = this._firstSignOrder(openid, order);
        const successXml = await ctx.curl(payUri, {
            method: 'POST',
            data: ctx.helper.json2xml(signedParams),
        });
        const json = ctx.helper.xml2json(successXml.data);
        if (json.return_code === 'FAIL') {
            return {
                code: -1,
                msg: json.return_msg,
            };
        }
        return this._secondSignOrder(json);
    }

    // 生成配置签名
    _createConfigSign(ticket, url) {
        const {
            service,
        } = this;
        const timestamp = parseInt(new Date().getTime() / 1000);
        const params = {
            jsapi_ticket: ticket,
            url,
            timestamp,
            noncestr: service.sign.createNonceStr(),
        };
        params.signature = service.sign.getConfigSign(params); // 配置签名，用于Web端调用接口
        return params;
    }

    // 生成支付签名
    _firstSignOrder(openid, order) {
        const {
            app,
            ctx,
            service,
        } = this;
        const {
            appId,
            mchId,
            notifyUrl,
        } = app.config.mp;
        const params = {
            openid: openid || '',
            appid: appId,
            mch_id: mchId,
            nonce_str: service.sign.createNonceStr(),
            body: order.body || '我是测试商品',
            out_trade_no: order.tradeNo || new Date().getTime(), // 内部订单号
            total_fee: order.totalFee || 1, // 单位为分的标价金额
            spbill_create_ip: ctx.ip || '127.0.0.1', // 支付提交用户端ip
            notify_url: notifyUrl, // 异步接收微信支付结果通知
            trade_type: 'JSAPI',
        };
        params.sign = service.sign.getPaySign(params); // 订单签名，用于验证支付通知
        return params;
    }

    // 第二次签名
    _secondSignOrder(json) {
        const {
            app,
            service,
        } = this;
        const {
            appId,
        } = app.config.mp;
        const res = {
            appId,
            timeStamp: service.sign.createTimestamp(),
            nonceStr: json.nonce_str,
            package: `prepay_id=${json.prepay_id}`,
            signType: 'MD5',
        }; // 不能随意增减，必须是这些字段
        res.paySign = service.sign.getPaySign(res); // 第二次签名，用于提交到微信
        return res;
    }
    async addGuide(guide_openid, token) {
        let data = {
            guide_openid: guide_openid,
        };
        const res = await this.ctx.curl(`${addGuideUri}?access_token=${token}`, {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
            timeout: 6000,
        });
        if (res.status === 200) {
            return res.data;
        } else {
            this.ctx.logger.error('res.status：' + res.status);
        }

    }
    async delGuide(guide_openid, token) {
        let data = {
            guide_openid: guide_openid
        };
        const res = await this.ctx.curl(`${delGuideUri}?access_token=${token}`, {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
        });
        if (res.status === 200) {
            return res.data;
        } else {
            this.ctx.logger.error('res.status：' + res.status);
        }
    }
    async setGuideConfig(Welcome, token) {
        let data = {
            is_delete: false,//操作类型，false表示添加 true表示删除
            guide_auto_reply: {
                content: Welcome,
                msgtype: 1,//1表示文字，2表示图片，3表示小程序卡片
            },
        };
        const res = await this.ctx.curl(`${setGuideConfig}?access_token=${token}`, {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
        });
        if (res.status === 200) {
            return res.data;
        } else {
            this.ctx.logger.error('res.status：' + res.status);
        }
    }
    async guideCreateQRCode(guide_openid, token) {
        let data = {
            guide_openid: guide_openid,
        };
        const res = await this.ctx.curl(`${guideCreateQRCode}?access_token=${token}`, {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
        });
        if (res.status === 200) {
            return res.data;
        } else {
            this.ctx.logger.error('res.status：' + res.status);
        }
    }
    async create(menuContent, token) {
        let data = menuContent;
        const res = await this.ctx.curl(`${create}?access_token=${token}`, {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
        });
        if (res.status === 200) {
            return res.data;
        } else {
            this.ctx.logger.error('res.status：' + res.status);
        }
    }
    async getCurrentSelfmenuInfo(token) {
        const res = await this.ctx.curl(`${getCurrentSelfmenuInfo}?access_token=${token}`, {
            method: 'GET',
            dataType: 'json',
        });
        if (res.status === 200) {
            return res.data;
        } else {
            this.ctx.logger.error('res.status：' + res.status);
        }
    }
    async deleteSelfmenuInfo(token) {
        const res = await this.ctx.curl(`${deleteSelfmenuInfo}?access_token=${token}`, {
            method: 'GET',
            dataType: 'json',
        });
        if (res.status === 200) {
            return res.data;
        } else {
            this.ctx.logger.error('res.status：' + res.status);
        }
    }
    async addGuideBuyerRelation(guide_openid, openid, token) {
        let data = {
            guide_openid: guide_openid,
            openid: openid
        };
        const res = await this.ctx.curl(`${addGuideBuyerRelation}?access_token=${token}`, {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
        });
        if (res.status === 200) {
            return res.data;
        } else {
            this.ctx.logger.error('res.status：' + res.status);
        }
    }
    async getwxacodeunlimit(scene_str, accessToken) {
        const { app } = this;
        let bodyInfo = {
        };
        bodyInfo = {
            scene: scene_str
        };
        const urlResult = await this.ctx.curl(`${wxacodeunlimit}?access_token=${accessToken}`, {
            method: 'POST',
            data: bodyInfo,
            headers: {
                'Content-Type': 'application/json',
            },
            dataType: 'image/jpeg',
            timeout: 6000,
        });
        if (urlResult.status === 200) {
            let result = !urlResult.data.errcode ? await app.oss.putBuffer('wechapp/qr' + scene_str + '_' + new Date().getTime() + '.png', urlResult.data) : '';
            return result && result.url || '';
        } else {
            throw Error('获取二维码失败');
        }

    }
}

module.exports = WCSService;