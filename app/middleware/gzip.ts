// app/middleware/gzip.ts
// 使用 gzip 压缩
import isJSON from 'koa-is-json';
import * as zlib from 'zlib';
import { Context } from 'egg';

export default function gzipMiddleware(options: any): any {
  return async function gzip(ctx: Context, next) {
    await next();

    // 后续中间件执行完成后将响应体转换成 gzip
    let body = ctx.body;
    if (!body) return;

    // 支持 options.threshold
    if (options.threshold && ctx.length < options.threshold) return;

    if (isJSON(body)) body = JSON.stringify(body);

    // 设置 gzip body，修正响应头
    const stream = zlib.createGzip();
    stream.end(body);
    ctx.body = stream;
    ctx.set('Content-Encoding', 'gzip');
  };
};
