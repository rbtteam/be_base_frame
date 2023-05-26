'use strict';

const Service = require('egg').Service;
// const request = require('request');

const getCustomerListUri = 'https://qyapi.weixin.qq.com/cgi-bin/externalcontact/list'; //获取客户列表
const getByUserUri = 'https://qyapi.weixin.qq.com/cgi-bin/externalcontact/batch/get_by_user'; //批量获取客户详情
const getCustomerInfoUri = 'https://qyapi.weixin.qq.com/cgi-bin/externalcontact/get'; //获取客户详情
const getFollowUserListUri = 'https://qyapi.weixin.qq.com/cgi-bin/externalcontact/get_follow_user_list'; //获取配置了客户联系功能的成员列表
const updateRemarkUri = 'https://qyapi.weixin.qq.com/cgi-bin/externalcontact/remark'; //修改客户备注
const transferCustomerUri = 'https://qyapi.weixin.qq.com/cgi-bin/externalcontact/transfer_customer'; //分配在职成员的客户
const sendWelcomeUri = 'https://qyapi.weixin.qq.com/cgi-bin/externalcontact/send_welcome_msg'; //发送新用户欢迎语
const unassignedListUri = 'https://qyapi.weixin.qq.com/cgi-bin/externalcontact/get_unassigned_list'; //获取待分配的离职成员列表
const resignedTransferCustomerUri = 'https://qyapi.weixin.qq.com/cgi-bin/externalcontact/resigned/transfer_customer'; //分配离职成员的客户
const transferGroupchatUri = 'https://qyapi.weixin.qq.com/cgi-bin/externalcontact/groupchat/transfer'; //分配离职成员的客户群
const groupchatListUri = 'https://qyapi.weixin.qq.com/cgi-bin/externalcontact/groupchat/list'; //获取客户群列表
const groupchatUri = 'https://qyapi.weixin.qq.com/cgi-bin/externalcontact/groupchat/get'; //获取群详情
const sendGroupWecomeUri = 'https://qyapi.weixin.qq.com/cgi-bin/externalcontact/add_msg_template'; //创建企业群发
const chatJoinWayListUri = 'https://qyapi.weixin.qq.com/cgi-bin/externalcontact/groupchat/get_join_way'; //获取企业微信群活码列表
const addChatJoinWayUri = 'https://qyapi.weixin.qq.com/cgi-bin/externalcontact/groupchat/add_join_way'; //添加企业微信群活码
const updateChatJoinWayUri = 'https://qyapi.weixin.qq.com/cgi-bin/externalcontact/groupchat/update_join_way'; //修改企业微信群活码
const deleteChatJoinWayUri = 'https://qyapi.weixin.qq.com/cgi-bin/externalcontact/groupchat/del_join_way'; //移除企业微信群活码
const getUserUri = 'https://qyapi.weixin.qq.com/cgi-bin/user/get'; //获取成员详情

const jsonType = {
    dataType: 'json',
};

class QYChatService extends Service {

    /**
     * 获取客户列表
     * @param {String} access_token 
     * @param {String} userid 企业成员的userid
     * @returns {Object} 企业微信返回的客户列表
     * @see https://qyapi.weixin.qq.com/cgi-bin/externalcontact/list?access_token=ACCESS_TOKEN&userid=USERID
     */
    async getCustomerList(access_token, userid) {
        try {
            const url = `${getCustomerListUri}?access_token=${access_token}&userid=${userid}`;
            const res = await this.ctx.curl(url, jsonType);
            return res.data.external_userid;
        } catch (error) {
            this.ctx.logger.error(error);
            return null;
        }
    }

    /**
     * 批量获取客户详情
     * @param {String} access_token 
     * @param {Object} data 企业成员的userid列表
     * @return {Object} 企业微信返回的客户详情列表  
     * @see https://qyapi.weixin.qq.com/cgi-bin/externalcontact/batch/get_by_user?access_token=ACCESS_TOKEN
     */
    async getCustomerInfoList(access_token, data) {
        try {
            const infoUrl = `${getByUserUri}?access_token=${access_token}`;
            const infoRes = await this.ctx.curl(infoUrl, {
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify(data),
            });
            return infoRes.data.external_contact_list;
        } catch (error) {
            this.ctx.logger.error(error);
            return null;
        }
    }

    /**
     * 获取客户详情
     * @param {String} access_token 
     * @param {String} external_userid 客户id
     * @param {String} cursor 上次请求返回的next_cursor
     * @returns {Object} 企业微信返回的客户详情
     * @see https://qyapi.weixin.qq.com/cgi-bin/externalcontact/get?access_token=ACCESS_TOKEN&external_userid=EXTERNAL_USERID&cursor=CURSOR
     */
    async getCustomerInfo(access_token, external_userid) {
        try {
            const url = `${getCustomerInfoUri}?access_token=${access_token}&external_userid=${external_userid}`;
            const res = await this.ctx.curl(url, jsonType);
            return res.data;
        } catch (error) {
            this.ctx.logger.error(error);
            return null;
        }
    }

    /**
     * 获取配置了客户联系功能的成员列表
     * @param {String} access_token 
     * @return {Object} 企业微信返回的配置了客户联系功能的成员列表
     * @see https://qyapi.weixin.qq.com/cgi-bin/externalcontact/get_follow_user_list?access_token=ACCESS_TOKEN
     */
    async getFollowUserList(access_token) {
        try {
            const url = `${getFollowUserListUri}?access_token=${access_token}`;
            const res = await this.ctx.curl(url, jsonType);
            return res.data.follow_user;
        } catch (error) {
            this.ctx.logger.error(error);
            return null;
        }
    }

    /**
     * 修改客户备注信息
     * @param {String} access_token 
     * @param {Object} data 企业成员的userid,外部联系人的userid,备注，描述，备注公司名称，备注手机号，备注图片 
     * @return {Object} 返回修改备注结果
     * @see https://qyapi.weixin.qq.com/cgi-bin/externalcontact/remark?access_token=ACCESS_TOKEN
     */
    async updateRemark(access_token, data) {
        try {
            const url = `${updateRemarkUri}?access_token=${access_token}`;
            const res = await this.ctx.curl(url, {
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify(data),
            });
            return res.data;
        } catch (error) {
            this.ctx.logger.error(error);
            return null;
        }
    }

    /**
     * 分配在职成员的客户
     * @param {String} access_token 
     * @param {Object} data 原跟进成员的userid,接替成员的userid,客户的external_userid列表，转移成功后发给客户的消息
     * @return {Object} 企业微信返回的转移结果
     * @see https://qyapi.weixin.qq.com/cgi-bin/externalcontact/transfer_customer?access_token=ACCESS_TOKEN
     */
    async transferCustomer(access_token, data) {
        try {
            const url = `${transferCustomerUri}?access_token=${access_token}`;
            const res = await this.ctx.curl(url, {
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify(data),
            });
            return res.data;
        } catch (error) {
            this.ctx.logger.error(error);
            return null;
        }
    }

    /**
     * 发送新客户欢迎语
     * @param {String} access_token 
     * @param {Object} data 企业微信发送欢迎语模板
     * @return {Object} 企业微信返回欢迎语发送结果
     * @see https://qyapi.weixin.qq.com/cgi-bin/externalcontact/send_welcome_msg?access_token=ACCESS_TOKEN
     */
    async sendWelcome(access_token, data) {
        try {
            const url = `${sendWelcomeUri}?access_token=${access_token}`;
            const res = await this.ctx.curl(url, {
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify(data),
            });
            return res.data;
        } catch (error) {
            this.ctx.logger.error(error);
            return null;
        }
    }

    /**
     * 获取待分配的离职成员列表
     * @param {String} access_token 
     * @param {Object} data 分页查询，返回最大记录数，分页查询游标
     * @return {Object} 企业微信返回的待分配离职成员列表
     * @see https://qyapi.weixin.qq.com/cgi-bin/externalcontact/get_unassigned_list?access_token=ACCESS_TOKEN
     */
    async unassignedList(access_token, data) {
        try {
            const url = `${unassignedListUri}?access_token=${access_token}`;
            const res = await this.ctx.curl(url, {
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify(data),
            });
            return res.data;
        } catch (error) {
            this.ctx.logger.error(error);
            return null;
        }
    }

    /**
     * 分配离职成员的客户
     * @param {String} access_token 
     * @param {Object} data 原跟进成员的userid，接替成员的userid，客户的external_userid列表
     * @returns {object}  企业微信返回的转移结果
     * @see https://qyapi.weixin.qq.com/cgi-bin/externalcontact/resigned/transfer_customer?access_token=ACCESS_TOKEN
     */
    async resignedTransferCustomer(access_token, data) {
        try {
            const url = `${resignedTransferCustomerUri}?access_token=${access_token}`;
            const res = await this.ctx.curl(url, {
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify(data),
            });
            return res.data;
        } catch (error) {
            this.ctx.logger.error(error);
            return null;
        }
    }

    /**
     * 分配离职成员的客户群
     * @param {String} access_token 
     * @param {Object} data 需要转群主的客户群ID列表，新群主ID
     * @returns {Object} 企业微信返回的继承结果
     * @see https://qyapi.weixin.qq.com/cgi-bin/externalcontact/groupchat/transfer?access_token=ACCESS_TOKEN
     */
    async transferGroupchat(access_token, data) {
        try {
            const url = `${transferGroupchatUri}?access_token=${access_token}`;
            const res = await this.ctx.curl(url, {
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify(data),
            });
            return res.data;
        } catch (error) {
            this.ctx.logger.error(error);
            return null;
        }
    }

    /**
     * 获取客户群列表
     * @param {String} access_token 
     * @param {Object} data 客户跟进状态过滤，群主过滤，用户ID列表，分页查询游标，分页
     * @returns {Object} 企业微信返回的客户群列表
     * @see https://qyapi.weixin.qq.com/cgi-bin/externalcontact/groupchat/list?access_token=ACCESS_TOKEN
     */
    async groupChatList(access_token, data) {
        try {
            const url = `${groupchatListUri}?access_token=${access_token}`;
            const res = await this.ctx.curl(url, {
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify(data),
            });
            return res.data;
        } catch (error) {
            this.ctx.logger.error(error);
            return null;
        }
    }

    /**
     * 获取客户群详情
     * @param {String} access_token 
     * @param {Object} data 客户群ID，是否需要返回群成员的名字
     * @returns {Object} 企业微信返回的群详情
     * @see https://qyapi.weixin.qq.com/cgi-bin/externalcontact/groupchat/get?access_token=ACCESS_TOKEN
     */
    async groupChatInfo(access_token, data) {
        try {
            const url = `${groupchatUri}?access_token=${access_token}`;
            const res = await this.ctx.curl(url, {
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify(data),
            });
            return res.data;
        } catch (error) {
            this.ctx.logger.error(error);
            return null;
        }
    }

    /**
     * 创建企业群发
     * @param {String} access_token 
     * @param {Object} data 群发任务的类型，附件类型，图文消息标题，图文消息的链接，小程序消息标题，小程序消息封面的mediaid，小程序appid，小程序page路径，视频的media_id，文件的media_id
     * @returns {Object} 无效或无法发送的external_userid列表，企业群发消息的id
     * @see https://qyapi.weixin.qq.com/cgi-bin/externalcontact/add_msg_template?access_token=ACCESS_TOKEN
     */
    async sendGroupWecome(access_token, data) {
        try {
            const url = `${sendGroupWecomeUri}?access_token=${access_token}`;
            const res = await this.ctx.curl(url, {
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify(data),
            });
            return res.data;
        } catch (error) {
            this.ctx.logger.error(error);
            return null;
        }
    }

    /**
     * 获取企业微信群活码详情
     * @param {Stringn} access_token 
     * @param {Object} data 联系方式的配置id
     * @returns {Object} 企业微信返回的群活码详情
     * @see https://qyapi.weixin.qq.com/cgi-bin/externalcontact/groupchat/get_join_way?access_token=ACCESS_TOKEN
     */
    async chatJoinWayList(access_token, data) {
        try {
            const url = `${chatJoinWayListUri}?access_token=${access_token}`;
            const res = await this.ctx.curl(url, {
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify(data),
            });
            return res.data;
        } catch (error) {
            this.ctx.logger.error(error);
            return null;
        }
    }

    /**
     * 创建企业微信群活码
     * @param {String} access_token 
     * @param {Object} data 场景,联系方式的备注信息,是否自动新建群,自动建群的群名前缀,自动建群的群起始序号,使用该配置的客户群ID列表,state参数
     * @returns {Object} 企业微信返回的群活码创建结果
     * @see https://qyapi.weixin.qq.com/cgi-bin/externalcontact/groupchat/add_join_way?access_token=ACCESS_TOKEN
     */
    async addChatJoinWay(access_token, data) {
        try {
            const url = `${addChatJoinWayUri}?access_token=${access_token}`;
            const res = await this.ctx.curl(url, {
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify(data),
            });
            return res.data.config_id;
        } catch (error) {
            this.ctx.logger.error(error);
            return null;
        }
    }

    /**
     * 修改企业微信群活码
     * @param {String} access_token 
     * @param {Object} data 同创建群活码
     * @returns {Object} 企业微信返回的群活码更新结果
     * @see https://qyapi.weixin.qq.com/cgi-bin/externalcontact/groupchat/update_join_way?access_token=ACCESS_TOKEN
     */
    async updateChatJoinWay(access_token, data) {
        try {
            const url = `${updateChatJoinWayUri}?access_token=${access_token}`;
            const res = await this.ctx.curl(url, {
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify(data),
            });
            return res.data;
        } catch (error) {
            this.ctx.logger.error(error);
            return null;
        }
    }

    /**
     * 移除企业微信群活码
     * @param {String} access_token 
     * @param {Object} data 企业联系方式的配置id
     * @returns {Object} 企业微信返回群活码删除结果
     * @see https://qyapi.weixin.qq.com/cgi-bin/externalcontact/groupchat/del_join_way?access_token=ACCESS_TOKEN
     */
    async deleteChatJoinWay(access_token, data) {
        try {
            const url = `${deleteChatJoinWayUri}?access_token=${access_token}`;
            const res = await this.ctx.curl(url, {
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify(data),
            });
            return res.data;
        } catch (error) {
            this.ctx.logger.error(error);
            return null;
        }
    }

    /**
     * 获取成员详情
     * @param {String} access_token 
     * @param {String} userid 成员Id
     * @returns {Object} 企业微信返回的成员信息
     * @see https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=ACCESS_TOKEN&userid=USERID
     */
    async getUser(access_token, userid) {
        try {
            const url = `${getUserUri}?access_token=${access_token}&userid=${userid}`;
            const res = await this.ctx.curl(url, jsonType);
            return res.data;
        } catch (error) {
            this.ctx.logger.error(error);
            return null;
        }
    }

}

module.exports = QYChatService;