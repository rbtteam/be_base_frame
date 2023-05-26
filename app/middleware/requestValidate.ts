'use strict';
/**
 * 请求验证，参数和token
 * @returns 
 */
import { Context } from 'egg';

export default (): any => {
    return async function requestValidate(ctx: Context, next: () => Promise<any>) {
        // 参数验证
        try {
            ctx.paramsIndex = ctx.helper.createParamsIndex();
            // joi参数验证
            let apiName: string = 'asc_' + (ctx && ctx.req && ctx.req.method && ctx.req.method.replace(/\//g, '_')) + ctx._matchedRoute.replace(/\//g, '_') || "";
            const joiValidate = ctx.app.parameters[apiName];
            if (joiValidate) {
                const result = await joiValidate.validateAsync({ ...ctx.request.body, ...ctx.request.query, ...ctx.request.params, ...ctx.params, });
                ctx.joiParams = result;
            }
            
            // token验证 
            const whiteList = ctx.app.config.tokenConfig.urlWhiteList;
            if (ctx._matchedRoute === '*' || whiteList.indexOf(ctx._matchedRoute) >= 0) {
                await next();
            } else {
                await ctx.app.oAuth2Server.authenticate({
                    grantType: 'password',
                })(ctx, next);
            }
        } catch (error: any) {
            // 参数验证错误
            ctx.logger.error( `${ctx.paramsIndex} ${error}  ${error.stack}`);
            if (error.isJoi) {
                ctx.body = {
                    code: ctx.code.PARAMETERS_ERROR,
                    msg: `${error.message}`,
                    data: {}
                };
                ctx.status = 200;
                return;
            }
            // 其他异常
            ctx.body = { code: ctx.code.HANDLE_ERROR, msg: error.message, data: {} };
            ctx.status = 500;
            return;
        }
    };
};