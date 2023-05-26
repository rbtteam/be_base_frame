import * as fs from 'fs';
const json5 = require('json5');
import _ = require('lodash');
let lev = 1;




export default class genServiceCode { 

  async BuildResult(properties) {
    let code = '';
    try {
      if (properties) {
        let kg = _.repeat('  ', lev);
        for (let item in properties) {
          if (properties[item].type !== 'object' && properties[item].type !== 'array') {
            var des = properties[item].description || '';
            code += kg + item + ': \'\', // ' + des + '\n';
          } else {
            lev++;

            if (properties[item].type === 'object') {
              code += kg + item + ': {\n';
              code += await this.BuildResult(properties[item].properties);
              code += kg + '},\n'
            } else { // array
              code += kg + item + ': [{\n';
              code += await this.BuildResult(properties[item].items.properties);
              code += kg + '}],\n'
            }

          }
        }
      }
      return code;
    }
    catch (e) {
      console.log("生成文件出错了，buildResult" + e);
      return code;
    }

  }
  async genCode(path, dir,projectName,fname, interfaceList,fileType) {
    try {
      //console.log(path+' begin');
      let template ='';
      let code = '';
      let parModelList = '';
      let resModelList = '';
      for (let i = 0; i < interfaceList.length; i++) {
        let prr = interfaceList[i].path.split('/');
        let methodName = prr[prr.length - 1];
        let pModel ='iP'+interfaceList[i]._id;
        let rModel ='iR'+interfaceList[i]._id;
        let method = interfaceList[i].method.toLowerCase();
        try {
          // code += '/** ' + interfaceList[i].title + '\n';
          // code += ' * @param method ' + interfaceList[i].method + '\n';
          // if (interfaceList[i].method === 'GET') {
          //   for (let j = 0; j < interfaceList[i].req_query.length; j++) {
          //     code += ' * @param ' + interfaceList[i].req_query[j].name + " \n";
          //   }
          // } else {
          //   code += ' * @param ' + json5.stringify(interfaceList[i].req_body_other) + " \n";
          // }
          // let returnJson = json5.parse(interfaceList[i].res_body);
          // code += ' * @returns ' + json5.stringify(returnJson.properties.data) + ' \n';
          // code += ' */\n'
          // code += 'async ' + methodName + '() { \n';
          // code += '  const { app, ctx, user, service } = this;\n';
          // code += '  let resultJson = { \n';
          // lev = 2;
          // if (returnJson.properties && returnJson.properties.data && returnJson.properties.data.properties) {
          //   code += await this.BuildResult(returnJson.properties.data.properties);
          // }
          code += '  '+method+'_'+methodName+'(arg0:iP'+interfaceList[i]._id+'): Promise<iR'+interfaceList[i]._id+'>;\n';
          if(parModelList!=''){
            parModelList+=',';
            resModelList+=',';
          }
          parModelList+=pModel;
          resModelList+=rModel;
        }
        catch (e) {
          console.log("生成文件出错了， for buildResult" + e);
        }
      }
      code += '}\n';
      template += 'import {' +parModelList+' } from \'../../../controller/parModel/'+projectName+'/'+fname+'\';\n';
      template += 'import {' +resModelList+' } from \'../../../controller/resModel/'+projectName+'/'+fname+'\';\n';
      template += 'export interface i'+_.capitalize(fname)+ ' { \n';
      template += code;
      if (fs.existsSync(path)) {
        fs.rmSync(path);
      }
      fs.writeFileSync(path, template, 'utf8');
      console.log(path + ' 生成成功');
      return 1;
    } catch (e) {
      console.log("生成文件出错了，" + e);
      return 0;
    }
  }
}
