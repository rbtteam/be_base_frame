'use strict';
const Service = require('egg').Service;

/**
 * 微信开放平台相关接口
 * @see https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/product/Third_party_platform_appid.html
 */
class WcopService extends Service {
    /**
     * 获取第三方平台令牌
     * @param {string} ticket 微信后台推送的 ticket
     * @returns {component_access_token,expires_in}
     */
    async getToken(ticket) {
        try {
            const {
                appId,
                appSecret,
            } = this.app.config.wxapi.component;
            const url = 'https://api.weixin.qq.com/cgi-bin/component/api_component_token';
            const res = await this.ctx.curl(url, {
                method: 'POST',
                contentType: 'json',
                dataType: 'json',
                data: {
                    component_appid: appId,
                    component_appsecret: appSecret,
                    component_verify_ticket: ticket,
                },
            });
            return res.data;
        } catch (error) {
            this.ctx.logger.error(error);

            return null;
        }
    }

    async getAccountToken(comToken, authorizerAppid, refToken) {
        try {
            const {
                appId,
            } = this.app.config.wxapi.component;
            const url = `https://api.weixin.qq.com/cgi-bin/component/api_authorizer_token?component_access_token=${comToken}`;
            const res = await this.ctx.curl(url, {
                method: 'POST',
                contentType: 'json',
                dataType: 'json',
                data: {
                    component_appid: appId,
                    authorizer_appid: authorizerAppid,
                    authorizer_refresh_token: refToken,
                },
            });
            return res.data;
        } catch (error) {
            this.ctx.logger.error(error);

            return null;
        }
    }

    /**
     * 启动ticket推送服务
     * @returns 
     */
    async startPushTicket() {
        try {
            const {
                appId,
                appSecret,
            } = this.app.config.wxapi.component;

            const url = 'https://api.weixin.qq.com/cgi-bin/component/api_start_push_ticket';
            const res = await this.ctx.curl(url, {
                method: 'POST',
                contentType: 'json',
                dataType: 'json',
                data: {
                    component_appid: appId,
                    component_secret: appSecret,
                },
            });
            return res.data;
        } catch (error) {
            this.ctx.logger.error(error);

            return null;
        }
    }

    async getPreauthCode(componentAccessToken) {
        try {
            const {
                appId,
            } = this.app.config.wxapi.component;

            const url = `https://api.weixin.qq.com/cgi-bin/component/api_create_preauthcode?component_access_token=${componentAccessToken}`;
            const res = await this.ctx.curl(url, {
                method: 'POST',
                contentType: 'json',
                dataType: 'json',
                timeout: 10000,
                data: {
                    component_appid: appId,
                },
            });
            return res.data;
        } catch (error) {
            this.ctx.logger.error(error);
            return null;
        }
    }

    /**
     * 使用授权码获取授权信息
     */
    async getAuthInfoByCode(componentAccessToken, code) {
        try {
            const {
                appId,
            } = this.app.config.wxapi.component;

            const url = `https://api.weixin.qq.com/cgi-bin/component/api_query_auth?component_access_token=${componentAccessToken}`;
            const res = await this.ctx.curl(url, {
                method: 'POST',
                contentType: 'json',
                dataType: 'json',
                data: {
                    component_appid: appId,
                    authorization_code: code,
                },
            });

            if (!res.data || !res.data.authorization_info || !res.data.authorization_info.authorizer_appid) {
                return null;
            }

            const infoUrl = `https://api.weixin.qq.com/cgi-bin/component/api_get_authorizer_info?component_access_token=${componentAccessToken}`;
            const infoRes = await this.ctx.curl(infoUrl, {
                method: 'POST',
                contentType: 'json',
                dataType: 'json',
                data: {
                    component_appid: appId,
                    authorizer_appid: res.data.authorization_info.authorizer_appid,
                },
            });

            if (!infoRes.data || !infoRes.data.authorizer_info || !infoRes.data.authorizer_info.user_name) {
                return null;
            }
            return {
                ...infoRes.data.authorization_info,
                ...infoRes.data.authorizer_info,
            };
        } catch (error) {
            this.ctx.logger.error(error);
            return null;
        }
    }
}

module.exports = WcopService;