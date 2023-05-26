'use strict';
const xml = require('xml-js');

module.exports = {
    xml2json(xmlStr) {
        let result = xml.xml2json(xmlStr, {
            compact: true,
            spaces: 4,
        });
        result = JSON.parse(result);
        return this.deleteCDATA(result.xml);
    },

    json2xml(json) {
        const result = xml.json2xml(json, {
            compact: true,
            spaces: 4,
        });
        return '<xml>\n' + result + '\n</xml>';
    },

    deleteCDATA(args) {
        const keys = Object.keys(args);
        const obj = {};
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            if (typeof args[k] === 'object') {
                obj[k] = args[k]._cdata;
            }
        }
        return obj;
    },
    /**
     * 随机生成字符串
     * @param {bool} lenRandom 长度是否随机
     * @param {Number} max 最大长度
     * @param {Number} min 最小长度
     */
    randomStr(lenRandom, max, min) {
        // 字符范围
        const strAndInteger = ['0',
            '1', '2', '3', '4', '5', '6', '7', '8', '9', 'q', 'w', 'e', 'r', 't', 'y',
            'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x',
            'c', 'v', 'b', 'n', 'm', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
            'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N',
            'M'
        ];

        let returnStr = '';
        let strLength = 0;
        // 长度不随机时使用最大长度
        if (!lenRandom) {
            strLength = max;
        } else {
            strLength = Math.round(Math.random() * (max - min)) + min;
        }

        for (let i = 0; i < strLength; i++) {
            const index = Math.round(Math.random() * (strAndInteger.length - 1));
            returnStr += strAndInteger[index];
        }

        return returnStr;
    }
};