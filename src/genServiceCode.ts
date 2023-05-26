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
            code += kg + '},\n'
            
          } else if (properties[item].type === 'array') {
            let items = properties[item].items;
            
            code += kg + item + isR+': [';
            switch (items.type) {
              case "integer": {
                code +='0';
                break;
              }
              case "number": {
                  code += '0';
                  break;
              }
              case "string": {
                  code += '\'\'';
                  break;
              }
              case "object": {
                code += '{\n';
                code += await this.BuildResult(items.properties, items.required, lev + 1);
                code += kg +'}';
                break;
              }
            }
            code += '],\n'
            
          } else {
              code += kg + '//' + properties[item].description + '\n';
              switch (properties[item].type) {// yapi to  joi type function
                  case "integer": {
                    code += kg + item + isR+': 0,';
                    break;
                  }
                  case "number": {
                      code += kg + item + isR+': 0,';
                      break;
                  }
                  case "string": {
                      code += kg + item + isR+': \'\',';
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
  async genCode(path, dir,projectName, fname, interfaceList,fileType) {
    try {
      //console.log(path+' begin');
      let template = fs.readFileSync(dir + '/template/service'+fileType+'txt').toString();
      let code = '';
      let parModelList = '';
      let resModelList = '';
      let achieve = '';
      let importStr = "";
      if (fs.existsSync(path)) {
        //读取历史已经实现了的内容
        const oldContent = fs.readFileSync(path).toString();
        let hc='\r';
        let hh='\n';
        let begin = '//#region achieve'
        let b = oldContent.indexOf(begin+hc+hh);
        if(b===-1){
           b = oldContent.indexOf(begin+hh);
           if(b === -1){
              b = oldContent.indexOf(begin+hc);
              if(b===-1){
                b = oldContent.indexOf(begin);
              }
           }
        }
        let end = '//#endregion achieve'
        let e = oldContent.indexOf(hc+hh+end);
        if(e === -1){
          e = oldContent.indexOf(hh+end);
          if(e === -1){
            e = oldContent.indexOf(hc+end);
            if(e === -1){
              e = oldContent.indexOf(end);
            }
          }
        }
        if(b!==-1 && e!==-1 && e>b){
          achieve = oldContent.substring(b+begin.length,e);
        }

        let begin2 = '//#region import';
        let b2 = oldContent.indexOf(begin2+hc+hh);
        if(b2===-1){
           b2 = oldContent.indexOf(begin2+hh);
           if(b2 === -1){
              b2 = oldContent.indexOf(begin2+hc);
              if(b2 === -1){
                b2 = oldContent.indexOf(begin2);
             }
           }
        }
        let end2 = '//#endregion import'
        let e2 = oldContent.indexOf(hc+hh+end2);
        if(e2 === -1){
          e2 = oldContent.indexOf(hh+end2);
          if(e2 === -1){
            e2 = oldContent.indexOf(hc+end2);
            if(e2 === -1){
              e2 = oldContent.indexOf(end2);
            }
          }
        }
        if(b2!==-1 && e2!==-1 && e2>b2){
          importStr = oldContent.substring(b2+begin2.length,e2);
        }
        console.log(begin2,b2,e2,"截取");
        fs.rmSync(path);
      }
      for (let i = 0; i < interfaceList.length; i++) {
        let prr = interfaceList[i].path.split('/');
        let methodName = prr[prr.length - 1];
        let pModel ='iP'+interfaceList[i]._id;
        let rModel ='iR'+interfaceList[i]._id;
        try {
          let returnJson = json5.parse(interfaceList[i].res_body);
          let method = interfaceList[i].method.toLowerCase();
          if(achieve.indexOf('async ' +method + '_'+ methodName + '(' ) === -1){ //已经实现了的方法 不生成
            code += 'async ' +method + '_'+ methodName + '(pars:iP'+ interfaceList[i]._id +') { \n';
            code += '  const { app, ctx, user, service } = this;\n';
            code += '  let resultJson:iR'+interfaceList[i]._id+' = {\n';
            code += '     code:0, \n';
            code += '     data:{ \n';
            lev = 4;
            if (returnJson.properties && returnJson.properties.data && returnJson.properties.data.properties) {
              code += await this.BuildResult(returnJson.properties.data.properties, returnJson.properties.data.required, lev);
            }
            code += '     },\n';
            code += '     msg:\'\', \n';
            code += '  };\n';
            code += '  //ToDo 实现后请删除本行注释\n'
            code += '  //return this.error<iR'+interfaceList[i]._id+'>(resultJson,\'出错了\');\n'
            code += '  return resultJson;\n';
            code += '}\n';
          }
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
      while (template.indexOf('[CName]') > -1) {
        template = template.replace('[CName]', fname);
      }
      template = template.replace('[MethodList]', code);
      template = template.replace('[parModelList]', 'import {' +parModelList+' } from \'../../controller/parModel/'+projectName+'/'+fname+'\'');
      template = template.replace('[resModelList]', 'import {' +resModelList+' } from \'../../controller/resModel/'+projectName+'/'+fname+'\'' );
      template = template.replace('[iService]', 'import {i'+_.capitalize(fname)+'} from \'../iService/'+projectName+'/'+fname+'\'');
      template = template.replace('[iServiceName]', 'i'+_.capitalize(fname));
      template = template.replace('[achieve]', achieve);
      template = template.replace('[import]', importStr);
      fs.writeFileSync(path, template, 'utf8');
      console.log(path + ' 生成成功');
      return 1;
    } catch (e) {
      console.log("生成文件出错了，" + e);
      return 0;
    }
  }
}
