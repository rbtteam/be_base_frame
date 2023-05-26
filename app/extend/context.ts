'use strict';

export default {
    code: {
        OK: 0, // 处理成功
        PARAMETERS_ERROR: 3, // 参数错误
        HANDLE_ERROR: 5, // 业务处理错误
        EXCEED_FRQ_ERROR: 6, // 访问频率过快
        NULL_DATA: 404, //数据不存在
        AUTH_FAILURE: 1000, // 认证失败
        SIGNATURE_DATE: 1001, // 签名过期
        FILE_UPLOAD_FAIL: 2001, // 文件上传失败
        ROLE_FAIL: 7, // 角色错误
    },
};