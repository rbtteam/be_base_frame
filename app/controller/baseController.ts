'use strict';

import { Controller } from 'egg';

/**
 * BaseController
 */
export default class BaseController extends Controller {
    public noCache(){
        return{
            code:0,
            msg:'无缓存',
            data:undefined
        }
    }
    public noAuth() {
        return {
            code:3000,
            msg:'角色不匹配',
            data:{}
        }
    }
    public noAuthQX(){
        return {
            code:3001,
            msg:'无访问权限',
            data:{}
        }
    }
    public stopTip(){
        return {
            code:5000,
            msg:'服务暂停访问',
            data:{}
        }
    }
    /**
     * 用户信息
     */
    get user() {
        return this.ctx.state.oauth.token.user;
    }

    get token() {
        return this.ctx.state.oauth.token.accessToken;
    }

    /**
     * 客户端信息
     */
    get client() {
        return this.ctx.state.oauth.token.client;
    }

    private getRoleInfo(typeNums:[number]) {
        let result = null;
        for (let type in typeNums) {
            switch ( Number(type)) {
                case 1:
                    result = this.user.supplier;
                    break; // 供货商
                case 2:
                    result = this.user.agent;
                    break; // 代理商
                case 3:
                    result = this.user.customerUser;
                    break; // 会员
                case 4:
                    result = this.user.User;
                    break; //员工
            }
        }
        return result;

    }
    // 权限验证
    private checkQX(){
        return true;
    }
    public success(data: any, status = 200) {
        this.ctx.body = { code: this.ctx.code.OK, data };
        this.ctx.status = status || 200;
    }

    public fail(code: number, msg = "") {
        this.ctx.body = { code, msg, data: {} };
        this.ctx.status = 200;
    }
    
    // 参数    
    public getParams<T>(): T {
        return this.ctx.joiParams;
    }
    // 缓存
    public async getCache<T>(){
        try{
            let apiName = this.ctx.routerPath;
            const apiConfig = this.ctx.app.config.apiConfig.filter(item => item.name === apiName )[0];
            const lev = this.ctx.app.config.lev;
            // 熔断处理
            if(apiConfig && apiConfig.lev<=lev){  
                // 角色验证
                if(apiConfig.auth ===1 || apiConfig.auth ===2) {
                    if(this.getRoleInfo(apiConfig.role)==null){
                        return this.noAuth();
                    }
                }
                if(apiConfig.auth === 2 ){
                    // 权限验证
                    if(this.checkQX() === false){
                        return this.noAuthQX();
                    }
                }
                
                // 缓存处理
                if(apiConfig.cache){                
                    let querystring = this.ctx.querystring;
                    let redisKey = apiName+querystring;
                    let result = await this.app.redis.get('common').get(redisKey);
                    if(result){
                        return {
                            code:0,
                            data:JSON.parse(result),
                            msg:'',
                        }
                    }else{
                        return this.noCache();
                    }
                }else{
                    return this.noCache();
                }
            }else{
                if(apiConfig){
                    return this.stopTip();
                }else{
                    return this.noAuth();
                }
            } 
        }catch(err){
            this.ctx.logger.error('getCache未知异常', err);
            return this.noCache();
        } 
    }
    // 设置缓存
    public async setCache(data){
        let apiName = this.ctx.routerPath;
        const apiConfig = this.ctx.app.config.apiConfig.filter(item => item.name === apiName )[0];
        if(apiConfig.cache){                
            let querystring = this.ctx.querystring;
            let redisKey = apiName+querystring;
            let result = await this.app.redis.get('common').setex(redisKey,apiConfig.cacheTime || 60 , JSON.stringify(data));
        }
            
    }
    
    
    
   
}