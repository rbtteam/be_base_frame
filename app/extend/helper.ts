'use strict';
import * as crypto from 'crypto';
import { Dictionary } from 'lodash';
import * as querystring from 'querystring'
export default {
    md5(str, encoding: crypto.Encoding = 'utf8') { return crypto.createHash('md5').update(str, encoding).digest('hex') },
    foo() {
        // this 是 helper 对象，在其中可以调用其他 helper 方法
        // this.ctx => context 对象
        // this.app => application 对象
    },
    // 默认小写字母加数字 t N 数组 a小写字母
    generateMixed(n: number, t: 'N' | 'a') {
        const charN = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        const chara = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        let chars = charN.concat(chara);
        switch (t) {
            case "N":
                {
                    chars = charN;
                    break;
                }
            case "a":
                {
                    chars = chara;
                    break;
                }
        }
        let res = '';
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * (chars.length - 1));
            res += chars[id];
        }
        return res;
    },
    /**
     * list转换为map
     */
    genMap(arr, key) {
        const map = {};
        for (let i = 0; i < arr.length; i++) {
            const k = arr[i][key];
            const v = arr[i];
            map[k] = v;
        }
        return map;
    },
    async number10to62(number) {
        // 打乱的字符
        const strArr: string[] = '8cT2khEL0yJasZSOMpqAYtFW6Gi1gNbmBCV9RdDQnHxlr75Xef4IvUzojP3wKu'.split('');
        let strLength = strArr.length;
        let sNumber = +number;
        let returnStr: string[] = [];

        do {
            let mod = sNumber % strLength;
            sNumber = (sNumber - mod) / strLength;
            returnStr.unshift(strArr[mod]);
        } while (sNumber);

        return returnStr.join('');
    }
    ,
    // preNo 1000订单类型 
    createOrderNo(preNo: string = '', midleNo = '') {
        const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let res = `1000${new Date().getTime()}${preNo || ''}${midleNo || ''}`;
        let n = 28 - res.length;
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * (chars.length - 1));
            res += chars[id];
        }
        return res;
    },
    // preNo 1001订单分账结算记录
    createOMRID(preNo: string = '', midleNo = '') {
        const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let res = `1001${new Date().getTime()}${preNo || ''}${midleNo || ''}`;
        let n = 28 - res.length;
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * (chars.length - 1));
            res += chars[id];
        }
        return res;
    },
    // preNo 1002订单快递发货记录
    createOKDRID(preNo: string = '', midleNo = '') {
        const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let res = `1002${new Date().getTime()}${preNo || ''}${midleNo || ''}`;
        let n = 28 - res.length;
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * (chars.length - 1));
            res += chars[id];
        }
        return res;
    },
    // preNo 11结算类型 
    createCSID(preNo: string = '', midleNo = '') {
        const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let res = `1100${new Date().getTime()}${preNo || ''}${midleNo || ''}`;
        let n = 28 - res.length;
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * (chars.length - 1));
            res += chars[id];
        }
        return res;
    },
    //  提现申请编号
    createCCID(preNo: string = '', midleNo = '') {
        const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let res = `1101${new Date().getTime()}${preNo || ''}${midleNo || ''}`;
        let n = 28 - res.length;
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * (chars.length - 1));
            res += chars[id];
        }
        return res;
    },
    //  付款编号
    createOutTradeNo(preNo: string = '', midleNo = '') {
        const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let res = `1102${new Date().getTime()}${preNo || ''}${midleNo || ''}`;
        let n = 28 - res.length;
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * (chars.length - 1));
            res += chars[id];
        }
        return res;
    },
    //  请求编号
    createParamsIndex(preNo = "", midleNo = "") {
        const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let res = `1${new Date().getTime()}${preNo || ''}${midleNo || ''}`;
        let n = 20 - res.length;
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * (chars.length - 1));
            res += chars[id];
        }
        return res;
    },
    //  企业微信记录
    createQYChatLogNo(preNo: string = '', midleNo = '') {
        const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let res = `1301${new Date().getTime()}${preNo || ''}${midleNo || ''}`;
        let n = 28 - res.length;
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * (chars.length - 1));
            res += chars[id];
        }
        return res;
    },
    //  直播roomId编号
    createLiveRoomId(preNo: string = '', midleNo = '') {
        const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let res = `1201${new Date().getTime()}${preNo || ''}${midleNo || ''}`;
        let n = 28 - res.length;
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * (chars.length - 1));
            res += chars[id];
        }
        return res;
    },
    //cc直播解密
    encryptTHQS(query, salt, method) {
        let time = Date.now();
        let ordered: Dictionary<string> = {};
        Object.keys(query).sort().forEach(function (key) {
            ordered[key] = query[key];
        });

        ordered.time = time.toString();
        ordered.salt = salt;

        let url = querystring.stringify(ordered);
        let hash = this.md5(url).toUpperCase();

        delete ordered.salt;
        ordered.hash = hash;
        if (method === 'get') {
            return querystring.stringify(ordered);
        } else if (method === 'post') {
            return ordered;
        } else {
            throw new Error('method only support get or post');
        }

    }
    ,
    // 生成thqs加密数据
    createTHQSData(requestData, apiKey, time) {
        let list: string[] = [];
        requestData = this.ksort(requestData);
        for (let i of requestData) {
            let value = i.key + '=' + i.value;
            list.push(value);
        }
        let requestString = list.join('&') + `&time=${time}`;
        let saltString = requestString + `&salt=${apiKey}`;
        let hashString = this.md5(saltString).toUpperCase();
        return requestString + `&hash=${hashString}`;
    }
    ,
    // thsq sort
    ksort(data) {
        let arrayList: {
            key: string,
            value: string,
        }[] = [];
        let sort = (a, b) => {
            return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
        };
        for (let key in data) {
            arrayList.push({
                key,
                value: encodeURIComponent(data[key]).replace(/%20/g, '%C2%A0'),
            });
        }
        return arrayList.sort(sort);
    },
    //  优惠券编号
    createCouponNo(preNo: string = '', midleNo = '') {
        const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let res = `1103${new Date().getTime()}${preNo || ''}${midleNo || ''}`;
        let n = 28 - res.length;
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * (chars.length - 1));
            res += chars[id];
        }
        return res;
    },
    //  小程序二维码场景值编号
    createWeChatAppQRSence(preNo: string = '', midleNo = '') {
        const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let res = `1103${new Date().getTime()}${preNo || ''}${midleNo || ''}`;
        let n = 28 - res.length;
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * (chars.length - 1));
            res += chars[id];
        }
        return res;
    },
    //求随机整数
    randomInt(n: number, m: number) {
        var random = Math.floor(Math.random() * (m - n + 1) + n);
        return random;
    },
    //json对象首字母大写
    jsonFirstBeginsToUpperCase(jsonObj: object) {
        if (typeof (jsonObj) == 'object') {
            for (let key in jsonObj) {
                jsonObj[key.substring(0, 1).toUpperCase() + key.substring(1)] = jsonObj[key];
                delete (jsonObj[key]);
            }
            return jsonObj;

        }
        return null;
    },
    //json对象首字母大写
    arrayJsonFirstBeginsToUpperCase(arrayJson: object) {
        if (typeof (arrayJson) === 'object' && Array.isArray(arrayJson)) {
            for (let key in arrayJson) {
                this.jsonFirstBeginsToUpperCase(arrayJson[key])
            }
            return arrayJson;

        }
        return null;
    },
    //判断输入字符串是否包含sql语句
    sqlReg(str: string) {
        let re = /select|update|delete|truncate|join|union|exec|insert|drop|count|'|"|;|>|<|%/i;
        if (re.test(str)) {
            return true;
        }
        return false
    }
};