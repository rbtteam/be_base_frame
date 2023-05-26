'use strict';
import * as _ from 'lodash';
import * as utility from 'utility';
import { Context, Application } from 'egg';
export default (app: Application) => {
    class Model {
        constructor(public ctx: Context) {
            this.ctx = ctx;
        }
        async getClient(clientId: string, clientSecret: string) {
            // 验证clienid

            // 验证是否是供货商平台
            const clientConfig = _.find(app.config.clientConfig.clients, (o) => {
                return o.ClientID === clientId;
            });
            if (clientConfig && clientId === clientConfig.ClientID && clientSecret === clientConfig.ClientSecret) {
                return clientConfig;
            }

            let clientInfo = await app.model.MerchantApplication.findByPk(clientId);
            if (!clientInfo || clientInfo.ClientSecret !== clientSecret || clientInfo.Status !== app.enums.shopStatus.PASS) {
                this.ctx.logger.error("clientInfo 信息未找到");
                throw new Error('clientInfo 信息未找到');
            }

            if (clientInfo.EndTime.getTime() < new Date().getTime()) {
                this.ctx.logger.error("clientInfo EndTime 过期 ");
                throw new Error('clientInfo EndTime 过期');
            }

            // 转换grants
            clientInfo.grants = [
                'password',
                app.enums.grants[clientInfo.Type],
            ];

            if (clientInfo.Type === app.enums.clientType.WXACCOUNT) {
                // 获取微信appID
                const wxClient = await app.model.MerchantWxApplication.findOne({
                    where: {
                        ClientID: clientId,
                    },
                    attributes: [
                        'AppID'
                    ],
                });

                if (!wxClient) {
                    this.ctx.logger.error("获取授权信息失败");
                    throw new Error('获取授权信息失败');
                }

                clientInfo.AppID = wxClient.AppID;
            }
            else if (clientInfo.Type === app.enums.clientType.WXMINIAPPS) {
                // 获取微信appID
                const wxClient = await app.model.MerchantWxApplication.findOne({
                    where: {
                        ClientID: clientId,
                    },
                    attributes: [
                        'AppID', 'AppSecret', 'MerchantID'
                    ],
                });

                if (!wxClient) {
                    this.ctx.logger.error("获取授权信息失败");
                    throw new Error('获取授权信息失败');
                }

                clientInfo.AppID = wxClient.AppID;
                clientInfo.AppSecret = wxClient.AppSecret;
                clientInfo.MerchantID = wxClient.MerchantID;
            }

            return clientInfo;
        }
        async getUser(username, password, client) {
            // 获取用户数信息
            let userAuth: any = null;
            if (client.MerchantID) {//存在商户信息验证商户
                userAuth = await app.model.CustomerAuthInfo.findOne({
                    where: {
                        Identifier: username,
                        Credential: utility.md5(password),
                        Status: 1,
                    },
                    include: [{
                        association: app.model.CustomerAuthInfo.hasOne(app.model.CustomerBase, { foreignKey: 'CustomerID', sourceKey: 'CustomerID' }),
                        attributes: [],
                        where: {
                            MerchantID: client.MerchantID,
                        },
                        required: true,
                    }
                    ],
                });
            }
            else {
                userAuth = await app.model.CustomerAuthInfo.findOne({
                    where: {
                        Identifier: username,
                        Credential: utility.md5(password),
                        Status: 1,
                    },
                });
            }
            if (!userAuth) return null;

            // 获取基础信息
            let userInfo = await app.model.CustomerBase.findByPk(userAuth.CustomerID, {
                raw: true,
            });
            if (!userInfo) return null;

            userInfo.Token = userAuth.Token || '';

            // 获取角色
            const agent = await app.model.CustomerAgent.findByPk(userAuth.CustomerID, {
                raw: true,
            });
            if (agent && agent.Status === app.enums.status.VALID) {
                userInfo.agent = agent;
            }

            const supplier = await app.model.CustomerSupplier.findOne({
                where: {
                    CustomerID: userInfo.CustomerID,
                    Status: app.enums.status.VALID,
                },
                raw: true,
            });
            if (supplier) {
                userInfo.supplier = supplier;
            }

            const customerUser = await app.model.CustomerUser.findByPk(userAuth.CustomerID, {
                raw: true,
            });
            if (customerUser && customerUser.Status === app.enums.status.VALID) {
                userInfo.customerUser = customerUser;
            }

            const User = await app.model.User.findByPk(userAuth.CustomerID, {
                raw: true,
            });
            if (User && User.Status === app.enums.status.VALID) {
                userInfo.user = User;
            }
            return userInfo;
        }
        async saveAuthorizationCode(code, client, user) {

        }
        async getAuthorizationCode(authorizationCode) { }
        async revokeAuthorizationCode(code) { }
        async saveToken(token, client, user) {

            if (!token) {
                return null;
            }

            const tokenInfo = Object.assign({}, token, { user }, { client });

            if (user.Token) {
                app.redis.get('common').del(`${app.enums.redisKey.USER_TOKEN}${user.Token}`);
            }

            tokenInfo.user.Token = token.accessToken;

            await app.redis.get('common').setex(`${app.enums.redisKey.USER_TOKEN}${token.accessToken}`, app.config.oAuth2Server.accessTokenLifetime, JSON.stringify(tokenInfo)); // 缓存数据
            // 修改token
            app.model.CustomerAuthInfo.update({
                Token: token.accessToken,
                UpdatedAt: new Date(),
            }, {
                where: {
                    CustomerID: user.CustomerID,
                    RegType: app.enums.grants[client.Type],
                }
            });

            return tokenInfo;
        }
        async getAccessToken(bearerToken) {
            let tokenInfo = await app.redis.get('common').get(`${app.enums.redisKey.USER_TOKEN}${bearerToken}`);
            if (tokenInfo) {
                tokenInfo = JSON.parse(tokenInfo);

                tokenInfo.accessTokenExpiresAt = new Date(tokenInfo.accessTokenExpiresAt)
                if (tokenInfo.accessTokenExpiresAt < new Date()) {
                    tokenInfo = null;
                }
            }

            return tokenInfo;
        }
        async revokeToken(token) { }
    }
    return Model;
};