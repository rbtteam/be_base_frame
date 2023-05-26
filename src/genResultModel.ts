import * as fs from 'fs';
const json5 = require('json5');
import _ = require('lodash');
let lev = 1;




export default class genServiceCode { 

  async BuildResult(properties,required: [], lev: number = 1) {
    let code = '';
    try {
      if (properties) {
        let kg = _.repeat('  ', lev);
        for (let item in properties) {
          let isrequired = required && required.find(function (el) { return el === item })
          let isR = isrequired === true ? '?' : '';
          if (properties[item].type === 'object') {
            
            code += kg + item + isR+':{\n';
            code += await this.BuildResult(properties[item].properties, properties[item].required, lev + 1);
            code += kg + '};\n'
            
          } else if (properties[item].type === 'array') {
            let items = properties[item].items;
            
            code += kg + item + isR+': Array<';
            switch (items.type) {
              case "integer": {
                code +='number';
                break;
              }
              case "number": {
                  code += 'number';
                  break;
              }
              case "string": {
                  code += 'string';
                  break;
              }
              case "object": {
                code += '{\n';
                code += await this.BuildResult(items.properties, items.required, lev + 1);
                code += kg +'}';
                break;
              }
            }
            code += '>;\n'
            
          } else {
              code += kg + '//' + properties[item].description + '\n';
              switch (properties[item].type) {// yapi to  joi type function
                  case "integer": {
                    code += kg + item + isR+': number;';
                    break;
                  }
                  case "number": {
                      code += kg + item + isR+': number;';
                      break;
                  }
                  case "string": {
                      code += kg + item + isR+': string;';
                      break;
                  }
                  
              }
              code += '\n';
            
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
  async genCode(path, dir, fname, interfaceList,fileType) {
    try {
      //console.log(path+' begin');
      let template = 'import { baseResult } from \'../../resultBase\';\n';
      let code = '';
      for (let i = 0; i < interfaceList.length; i++) {
        //let prr = interfaceList[i].path.split('/');
        //let methodName = prr[prr.length - 1];
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
          let returnJson = json5.parse(interfaceList[i].res_body);
          code += 'export interface iR'+interfaceList[i]._id+' extends baseResult { \n';
          code += '  data:{\n';
          lev = 2;
          if (returnJson.properties && returnJson.properties.data && returnJson.properties.data.properties) {
            code += await this.BuildResult(returnJson.properties.data.properties,returnJson.properties.data.required, lev);
          }
          code += '  }\n';
          code += '}\n';
        }
        catch (e) {
          console.log("生成文件出错了， for buildResultModel" + e);
        }
      }

      template = template+code;
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
