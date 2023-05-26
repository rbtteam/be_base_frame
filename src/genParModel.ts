import * as fs from 'fs';
var _ = require('lodash');
let lev = 1;


export default class genParModer { 

  async ApiValPar(arr) {
    let code = '';

    //生成参数校验
    for (let i = 0; i < arr.length; i++) {
      let apiName = 'iP'+ arr[i]._id;
      code += 'export interface ' + apiName + ' { \n';

      if ((arr[i].method === 'POST' || arr[i].method === 'PUT' || arr[i].method === 'DELETE') && arr[i].req_body_other) {
        let properties = arr[i].req_body_other.properties;
        let requiredArray = arr[i].req_body_other.required;
        lev = 1;
        code += await this.buildPar(properties, requiredArray);
      } else if (arr[i].method === 'GET' && arr[i].req_query && arr[i].req_query.length > 0) {
        let properties = arr[i].req_query;
        lev = 1;
        code += await this.buildParQuery(properties);
      } else {
        code += ' //没有参数\n';
      }
      code += '}\n'
    }
    return code;
  }
  async buildPar(properties, required, lev: number = 1) {
    let code = '';
    let kg = _.repeat('  ', lev);
    for (let item in properties) {
      let isrequired = required && required.find(function (el) { return el === item })
      let isR = isrequired === true ? '?' : '';
      if (properties[item].type === 'object') {
        
        code += kg + item + isR+':{\n';
        code += await this.buildPar(properties[item].properties, properties[item].required, lev + 1);
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
            code += await this.buildPar(items.properties, items.required, lev + 1);
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
    return code;
  }
  async buildParQuery(properties) {
    let code = '';
    let kg = _.repeat('  ', lev);
    for (let i = 0; i < properties.length; i++) {
      let queryParam = properties[i];
      
      
      let isrequired = queryParam.required === '1';
      code += kg + '//' + queryParam.desc + '\n';
      if (queryParam.example && queryParam.example.indexOf('number')!==-1) {
        code += kg + queryParam.name + (isrequired ? "" : "?") + ':number;';
      }
      else {
        code += kg + queryParam.name + (isrequired ? "" : "?") + ':string;';
      }
      code += '\n';
      

    }
    return code;
  }
  async genCode(path, dir, fname, interfaceList,fileType) {
    try {
      //let template = fs.readFileSync(dir+'/template/parameters.js').toString();
      let newarr = _.sortBy(interfaceList, ['method'])
      let code = '';
      code = await this.ApiValPar(newarr);

      if (fs.existsSync(path)) {
        fs.rmSync(path);
      }
      fs.writeFileSync(path, code, 'utf8');
      console.log(path + ' 生成成功');
      return 1;
    } catch (e) {
      console.log("生成文件出错了，" + e);
      return 0;
    }
  }
}
