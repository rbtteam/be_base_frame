'use strict';
import * as   OSS from 'ali-oss';
// https://help.aliyun.com/document_detail/64097.html
let client = new OSS({
    // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
    region: 'oss-cn-beijing',
    // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
    accessKeyId: 'LTAI5t9PGkHZqZK9GCx9Wzah',
    accessKeySecret: '9AwHbfVAa3I8x54tTFrJtnoJTGySsx',
    // 填写Bucket名称，例如examplebucket。
    bucket: 'rbtres',
    endpoint: "ossimg.bjrbt.cn",
    cname: true,
    // accessKeyId	String	通过阿里云控制台创建的AccessKey ID。
    // accessKeySecret]	String	通过阿里云控制台创建的AccessKey Secret。
    // stsToken	String	使用临时授权方式。更多信息，请参见使用STS进行临时授权。
    // bucket	String	通过控制台或PutBucket创建的Bucket。
    // endpoint	String	OSS访问域名。
    // region	String	Bucket所在的区域， 默认值为oss-cn-hangzhou。
    // internal	Boolean	是否使用阿里云内网访问，默认值为false。例如通过ECS访问OSS，则设置internal为true，采用internal的endpoint可节省费用。
    // cname	Boolean	是否支持上传自定义域名，默认值为false。如果设置cname为true，则endpoint传入自定义域名时，自定义域名需要先和Bucket进行绑定。
    // isRequestPay	Boolean	Bucket是否开启请求者付费模式，默认值为false。更多信息，请参见请求者付费模式。
    // secure	Boolean	设置secure为true，则使用HTTPS；设置secure为false，则使用HTTP。更多信息，请参见常见问题。
    // timeout	String|Number	超时时间，默认值为60000，单位为毫秒。
});

async function put() {
    try {
        // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
        // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
        // const result = await client.put('exampleobject.txt', path.normalize('D:\\localpath\\examplefile.txt'));
        // console.log(result);
    } catch (e) {
        console.log("未知异常put", e);
    }
}
async function putBuffer(url, bufferData) {
    try {
        let result = await client.put(`${url}`, bufferData);
        console.log(result);
        result.url = result.url.replace('https', 'http').replace('http', 'https').replace('ossimg.bjrbt.cn', 'rbtres.oss-cn-beijing.aliyuncs.com')
        return result;
    } catch (e) {
        console.log("未知异常putBuffer", e);
    }
}
async function putStream(url, streamData) {
    try {
        let result = await client.putStream(`${url}`, streamData);
        console.log(result);
        return result;
        // 使用'chunked encoding'。使用putStream接口时，SDK默认会发起一个'chunked encoding'的HTTP PUT请求。
        // 填写本地文件的完整路径，从本地文件中读取数据流。
        // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
        // let stream = fs.createReadStream('D:\\localpath\\examplefile.txt');
        // // 填写Object完整路径，例如exampledir/exampleobject.txt。Object完整路径中不能包含Bucket名称。
        // let result = await client.putStream('exampledir/exampleobject.txt', stream);
        // console.log(result);

        // 不使用'chunked encoding'。如果在options指定了contentLength参数，则不会使用chunked encoding。
        // let stream = fs.createReadStream('D:\\localpath\\examplefile.txt');
        // let size = fs.statSync('D:\\localpath\\examplefile.txt').size;
        // let result = await client.putStream(
        //     'exampledir/exampleobject.txt', stream, { contentLength: size });
    } catch (e) {
        console.log("未知异常putStream", e);
    }
};

export default {
    putStream,
    putBuffer,
    put
}