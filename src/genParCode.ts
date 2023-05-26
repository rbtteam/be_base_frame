import * as fs from 'fs';
var _ = require('lodash');
let lev = 1;



export default class genParCode {

  async ApiValPar(arr,template) {
    let code = '';

    //生成参数校验
    for (let i = 0; i < arr.length; i++) {
      let apiName = 'asc_' + arr[i].method.replace(/\//g, '_') + arr[i].path.replace(/\//g, '_');
      code += 'const ' + apiName + ' = Joi.object().keys({ \n';

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
      code += '});\n'
    }
    //export 校验
    let code2 = '';
    for (let i = 0; i < arr.length; i++) {
      code2 += '    asc_' + arr[i].method.replace(/\//g, '_') + arr[i].path.replace(/\//g, '_') + ',\n';
    }
    template = template.replace('[FiledList]',code);
    template = template.replace('[FiledNameList]',code2);
    return template;
  }
  async buildPar(properties, required) {
    let code = '';
    let kg = _.repeat('  ', lev);
    for (let item in properties) {
      if (properties[item].type !== 'object') {
        code += kg + '//' + properties[item].description + '\n';
        switch (properties[item].type) {// yapi to  joi type function
          case "integer": {
            code += kg + item + ':Joi.number().integer()';
            break;
          }
          default: {
            code += kg + item + ':Joi.' + properties[item].type + '()';
          }
        }
        let isrequired = required && required.find(function (el) { return el === item })
        if (isrequired) {
          code += '.required()';
        }
        if (properties[item].minLength) {
          code += '.min(' + properties[item].minLength + ')';
        }
        if (properties[item].maxLength) {
          code += '.max(' + properties[item].maxLength + ')';
        }
        code += ',\n';
      } else {
        lev++;
        code += kg + item + ':Joi.object().keys({\n';
        code += await this.buildPar(properties[item].properties, required);
        code += kg + '}),\n'
      }
    }
    return code;
  }
  async buildParQuery(properties) {
    let code = '';
    let kg = _.repeat('  ', lev);
    for (let i = 0; i < properties.length; i++) {
      let queryParam = properties[i];
      code += kg + '//' + queryParam.desc + '\n';
      if (queryParam.example && queryParam.example.indexOf('number')!==-1) {
        code += kg + queryParam.name + ':Joi.number()';
      }
      else {
        code += kg + queryParam.name + ':Joi.string().allow(\'\')';
      }
      let isrequired = queryParam.required === '1';
      if (isrequired) {
        code += '.required()';
      }
      code += ',\n';

    }
    return code;
  }
  async genCode(path, dir, fname, interfaceList,fileType) {
    try {
      let template = fs.readFileSync(dir+'/template/parameters'+fileType+'txt').toString();
      let newarr = _.sortBy(interfaceList, ['method'])
      let code = '';
      code = await this.ApiValPar(newarr,template);
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
