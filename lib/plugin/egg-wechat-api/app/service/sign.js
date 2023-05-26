'use strict';
const crypto = require('crypto');

const Service = require('egg').Service;

class SignService extends Service {
    // 生成随机字符串，用于微信支付
    createNonceStr() {
        return Math.random()
            .toString(36)
            .substr(2, 15);
    }

    // 生成时间戳，单位为秒，用于微信支付
    createTimestamp() {
        return parseInt(new Date().getTime() / 1000) + '';
    }

    // 序列化字符串
    raw(args) {
        const keys = Object.keys(args).sort(); // 参数名ASCII码从小到大排序（字典序）；
        let string = '';
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            if (k === 'sign' || !args[k]) {
                continue; // 如果参数的值为空不参与签名
            }
            if (typeof args[k] === 'object') {
                // 兼容xml场景，值为数组
                args[k] = args[k][0];
            }
            string += '&' + k + '=' + args[k];
        }
        string = string.substr(1);
        return string;
    }

    // 生成加密SHA1字符串
    sha1(str) {
        return crypto.createHash('sha1').update(str).digest('hex');
    }

    // 生成配置签名
    getConfigSign(args) {
        const rawStr = this.raw(args);
        const shaStr = this.sha1(rawStr);
        return shaStr.toLocaleLowerCase();
    }

    // 生成加密MD5字符串
    md5(str) {
        return crypto.createHash('md5').update(str).digest('hex');
    }

    // sha1(str) {
    //     return crypto.createHash('sha1').update(str).digest('hex');
    // }

    // 生成支付签名
    getPaySign(args) {
        const {
            apiKey,
        } = this.app.config.mp;
        const rawStr = this.raw(args);
        const md5Str = this.md5(rawStr + '&key=' + apiKey);
        return md5Str.toUpperCase();
    }

    /**
     * 去除尾部填充
     * @param {string} buf 需要去除填充的字符串
     */

    deMsgPadding(buff) {
        let pad = buff[buff.length - 1];
        if (pad < 1 || pad > 32) {
            pad = 0;
        }

        return buff.slice(0, buff.length - pad);
    }

    async wxDecryptMsg(timestamp, nonce, msgSignature, msgXml) {
        try {
            const { ctx, app } = this;
            // 验证消息来源
            const { verifyToken: token, encodingAESKey } = app.config.wxapi.message;
            const { Encrypt: encrypt } = ctx.helper.xml2json(msgXml);
            const arr = [token, timestamp, nonce, encrypt].sort();
            const signature = this.sha1(arr.join(''));

            if (msgSignature !== signature) {
                return new Error('签名不一致!');
            }

            // 生成解密key
            const key = new Buffer(encodingAESKey + '=', 'base64');

            const aesCipher = crypto.createDecipheriv('aes-256-cbc', key, key.slice(0, 16));
            aesCipher.setAutoPadding(false); // 自动填充
            let decipheredBuff = Buffer.concat([aesCipher.update(encrypt, 'base64'), aesCipher.final()]);

            // 去除尾部填充
            decipheredBuff = this.deMsgPadding(decipheredBuff);

            const lenNetOrderCorpid = decipheredBuff.slice(16); // 去除前16位随机字符串
            const msgLen = lenNetOrderCorpid.slice(0, 4).readUInt32BE(0); // 通过前4位字符获取加密前明文的长度
            const message = lenNetOrderCorpid.slice(4, msgLen + 4).toString(); // 提取明文内容

            return ctx.helper.xml2json(message);
        } catch (err) {
            this.ctx.logger.error('wxDecryptMsg', err);
            return err;
        }
    }
    async qywxDecryptMsg(token, encodingAESKey, timestamp, nonce, msgSignature, msgXml) {
        try {
            const { ctx } = this;
            const { Encrypt: encrypt } = ctx.helper.xml2json(msgXml);
            const arr = [token, timestamp, nonce, encrypt].sort();
            const signature = this.sha1(arr.join(''));

            if (msgSignature !== signature) {
                return new Error('签名不一致!');
            }

            // 生成解密key
            const key = new Buffer(encodingAESKey + '=', 'base64');

            const aesCipher = crypto.createDecipheriv('aes-256-cbc', key, key.slice(0, 16));
            aesCipher.setAutoPadding(false); // 自动填充
            let decipheredBuff = Buffer.concat([aesCipher.update(encrypt, 'base64'), aesCipher.final()]);

            // 去除尾部填充
            decipheredBuff = this.deMsgPadding(decipheredBuff);

            const lenNetOrderCorpid = decipheredBuff.slice(16); // 去除前16位随机字符串
            const msgLen = lenNetOrderCorpid.slice(0, 4).readUInt32BE(0); // 通过前4位字符获取加密前明文的长度
            const message = lenNetOrderCorpid.slice(4, msgLen + 4).toString(); // 提取明文内容

            return ctx.helper.xml2json(message);
        } catch (err) {
            this.ctx.logger.error('wxDecryptMsg', err);
            return err;
        }
    }
    async qywxCheckDecryptMsg(token, encodingAESKey, timestamp, nonce, msgSignature, echostr) {
        try {
            //const { ctx, app } = this;
            // 验证消息来源
            const arr = [token, timestamp, nonce, echostr].sort();
            const signature = this.sha1(arr.join(''));
            if (msgSignature !== signature) {
                this.ctx.logger.error(msgSignature, signature);
                return new Error('签名不一致!');
            }
            // 生成解密key
            const key = new Buffer(encodingAESKey + '=', 'base64');
            const aesCipher = crypto.createDecipheriv('aes-256-cbc', key, key.slice(0, 16));
            aesCipher.setAutoPadding(false); // 自动填充
            let decipheredBuff = Buffer.concat([aesCipher.update(echostr, 'base64'), aesCipher.final()]);
            // 去除尾部填充
            decipheredBuff = this.deMsgPadding(decipheredBuff);
            const lenNetOrderCorpid = decipheredBuff.slice(16); // 去除前16位随机字符串
            const msgLen = lenNetOrderCorpid.slice(0, 4).readUInt32BE(0); // 通过前4位字符获取加密前明文的长度
            const message = lenNetOrderCorpid.slice(4, msgLen + 4).toString(); // 提取明文内容
            this.ctx.logger.error(message);
            return message;
        } catch (err) {
            this.ctx.logger.error('wxDecryptMsg', err);
            return err;
        }
    }
}

module.exports = SignService;