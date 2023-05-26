'use strict';

export default {
    // 状态
    status: {
        INVALID: 0, // 无效 
        VALID: 1, // 有效
    },

    // 注册类型
    regType: {
        PASSWORD: 'password', // 账号密码登陆
        WXACCOUNT: 'wx-account', // 微信登陆
        WXMINIAPPS: 'wx-app',//微信小程序
    },

    // 性别
    sex: {
        UNKONW: 'x', // 未知
        BOY: 'b', // 男孩
        GIRL: 'g', // 女孩
    },
    wxSex: {
        1: 'b',
        2: 'g',
        0: 'x',
    },
    // 客户端类型
    clientType: {
        WEB: 1, // web/
        WXACCOUNT: 2, // 微信公众号
        WXMINIAPPS: 3,//微信小程序
        APPS: 4,   //APP应用
        QYCHAT: 5, //企业微信
    },
    // 微信第三方授权账号类型
    WXAuthType: {
        WXACCOUNT: 1, // 微信公众号
        WXMINIAPPS: 2, // 微信小程序
    },
    grants: {
        1: 'password',
        2: 'wx-account',
        3: 'wx-app',
    },
    // redis相关key
    redisKey: {
        // 基础信息
        USER_TOKEN: 'USER_TOKEN:', // 用户token
        WXAPPLICATION: 'WXAPPLICATION:',    // 微信应用信息
        DWZ_INCR_ID: 'DWZ_INCR_ID',         // 短网址自增ID
        SYNC_P: "",//
        PROJECTINFO_C: "PROJECTINFO_C:",//活动信息查看
        RouteDuplicate: "RouteDuplicate",//拦截重复请求
        //微信开放平台
        WECHAT_OP_TICKET: 'WECHAT_OP_TICKET', // 微信开放平台票据
        WECHAT_OP_TOKEN: 'WECHAT_OP_TOKEN', // 微信开放平台access_token
        WECHAT_ACCOUNT_TOKEN: 'WECHAT_ACCOUNT_TOKEN:', // 公众号access_token
        WECHAT_ACCOUNT_TICKET: 'WECHAT_ACCOUNT_TICKET:', // 公众号临时授权票据
        WECHAT_PRE_AUTH_CODE: 'WECHAT_PRE_AUTH_CODE:', // 微信开放平台第三方预授权码
        //企业微信
        QYWECHAT_SUITE_TICKET: 'QYWECHAT_SUITE_TICKET', // 企业微信服务商第三方平台微信推送票据 suite_ticket作为安全凭证
        QYWECHAT_SUITE_TOKEN: 'QYWECHAT_SUITE_TOKEN', // 企业微信第三方服务商微信suite_access_token
        QYWECHAT_PRE_AUTH_CODE: 'QYWECHAT_PRE_AUTH_CODE', // 企业微信第三方服务商微信 预授权码pre_auth_code
        QYWECHAT_PERMANENT_CODE: 'QYWECHAT_PERMANENT_CODE', // 企业微信第三方服务商微信 永久授权码 permanent_code
        QYWECHAT_QYWECHAT_TOKEN: 'QYWECHAT_QYWECHAT_TOKEN', // 企业微信第三方服务商获取企业应用access_token
        QYWECHAT_QYWECHAT_TICKET: 'QYWECHAT_QYWECHAT_TICKET', // 企业微信第三方服务商微信企业应用 临时票据用来开发jsSDK TICKET
        QYWECHAT_WROKLITE_TOKEN: 'QYWECHAT_WROKLITE_TOKEN', // 企业微信内部开发应用access_token
    },
    accountType: {
        ONLINE: 1, // 线上分账
        OFFLINE: 2, // 线下分账
    },
    //代理级别 (1省代 2组长 3业务员)
    customerAgentLev: {
        lev1: 1,
        lev2: 2,
        lev3: 3
    },
    shopStatus: {
        INVALID: 0, // 无效 
        PASSING: 1, // 审核中
        PASS: 2, // 有效
    },
    clientStatus: {
        INVALID: 0, // 无效 
        PASSING: 1, // 审核中
        PASS: 2, // 有效
    },
    wxAccountType: {
        SUBSCRIBE: 0,
        HISTORY: 1,
        SERVER: 2,
    },
    supplierType: {
        PERSONAL: 1, // 个人
        COMPANY: 2, // 企业 
        GOVERNMENT: 3, // 政府 
        OTHER: 4, // 其他
    },
    customerStatus: {
        INVALID: 0, // 无效 
        PASSING: 1, // 审核中
        PASS: 2, // 有效
        NOPASS: 3, // 拒绝
    },
    roleApplyStatus: {
        INVALID: 0, // 无效 
        PASSING: 1, // 审核中
        PASS: 2, // 有效
        NOPASS: 3, // 拒绝
    },
    role: {
        ROLE0: 'CustomerBase',
        ROLE1: 'CustomerAgent',
        ROLE2: 'CustomerSupplier',
        ROLE3: 'CustomerUser',
        ROLE4: 'User',
    },
    // 交易记录支出方式
    transactionType: {
        IN: 1,//收入
        OUT: 2//支出
    },
    // 结算到账方式
    settlementType: {
        MANUAL: 1, //手动提现
        REALTIME: 2 //实时
    },
    // 订单状态  // int   订单状态(  - 1、作废 0、用户取消 1、成功提交（待付款） 2、待发货（已付款） 3、已发货  4、已完成) 
    orderStatus: {
        DELETE: -1,//作废
        CANCEL: 0, // 订单取消
        WAIT: 1, // （成功提交）待支付
        PAID: 2, //  待发货（已付款）
        SEND: 3, //  已发货
        CONFIRM: 4,//已完成（用户已收货）
    },
    orderIsReturn: {
        YES: 1, // 已退 
        NO: 0, // 未退
    },
    // 售后订单
    afterSaleOrderStatus: {
        SAPPLY: 0,   //会员申请
        WAIT: 1,    // 1、退款中
        SEND: 2,    //  2、已发货
        CONFIRM: 3, // 3、确认收货，
        CONFIRM_REFUND: 4,  // 4、已退款退款
        REFUSE: 5   //、拒绝
    },
    // 提现申请
    cashingApplyPassStatus: {
        APPLY: 1, //申请中
        PASS: 2,//通过
        REFUSE: 3,//拒绝
    },
    // 结算记录来源
    customerSettlementFromType: {
        ORDER: 1, //订单
        AFTERORDER: 2,//退货
        CASHING: 3,//提现
        AGENTCommissionAmount: 4,// 全民代理人佣金
    }
    ,
    shopEdition: {
        trialVersion: "trialVersion",// 普通版
        deluxeVersion: "deluxeVersion"// 豪华版
    },
    moveType: {//移动列表方式
        up: 'up',//上衣
        down: 'down'//下移
    },
    ResourceType: {
        file: 2,
        dir: 1,
    },
    ReceiveInfoType: {// 商品送货方式
        supplier: 1,// 供应商发货
        toShop: 2, // 到店取货
        agentTo: 3 // 业务员送货
    },
    ServiceProvider: {// 直播平台
        cc: 10
    },
    ProductFrom: { // 商品来源
        supplier: 1,//供应商商品
        shop: 2,//店铺商品
        course: 3,//课程商品
    },
    LiveFrom: {// 直播间创建来源
        section: 1,// 课时
        course: 2,// 直播课程
        online: 3,//在线交流
    },
    OrderType: {//订单类型
        marketing: 1,//营销活动订单
        shopProduct: 2,//店铺订单
        course: 3,//课程订单
    },
    MerchantStatus: {
        INVALID: 0, // 无效 
        PASSING: 1, // 审核中
        PASS: 2, // 有效
    },
    MarketingType: {//营销活动
        fenxiao: 1, //分销
        gift: 2,     //赠送
        agent: 3,    //全民代理人
        sendCoupon: 4,//发券宝
        fenxiaoShop: 5,// 个人分销店铺
    },
    PromotionProjectStatus: {
        open: 1, //开启
        close: 2,//关闭
    },
    IsOnShelfSales: {//商品上架商城
        yes: 1,//是
        no: 0//否
    },
    CashingOutType: {//提现类型
        offlineTransfe: 1,//线下转账
        wechatWallet: 2,//微信钱包
        wechatTransferBankCard: 3//转账银行卡
    },
    CashingProgress: {//提现到账进度 
        wait: 0,//0未执行提现
        doing: 1,//1执行提现 
        done: 2,//2 提现到账成功
        error: 3 //s 3 提现执行错误，
    },
    CashingProgressBank: {
        PROCESSING: "PROCESSING",//处理中，如有明确失败，则返回额外失败原因；否则没有错误原因
        SUCCESS: "SUCCESS",//付款成功
        "FAILED": "FAILED",//（付款失败,需要替换付款单号重新发起付款）
        "BANK_FAIL": "BANK_FAIL",//银行退票，订单状态由付款成功流转至退票,退票时付款金额和手续费会自动退还

    },
    SendCouponType: {//发送优惠券方式
        immediate: 1,//直接发放
        beCollected: 2,//需要领取发放 
        taskBaby: 3,//任务宝
    },
    ProductType: {//商品规格配置 1 单规格 2多规格 3套装
        singleSpc: 1,//但硅谷
        variousSpc: 2,//多规格
        packagedGoods: 3,//套装组合商品
    },
    OrderFromType: {// 订单来源
        marketingFenxiao: 11,//分销订单
        marketingGift: 12,//赠品订单
        marketingAgent: 13,//全民代理人订单
        shopProductWShop: 21,//店铺微商城订单
        course: 31,//虚拟课程订单
    },
    MarketingProductFrom: {// 分销活动产品来源
        singleFenxiaoShop: 1, //个人店铺
        supFenxiaoAgent: 2,//上级代理
    }
};