import * as fs from 'fs';


export default class genCodeControllerClass {
  genCodeController (path,dir,projectName,fname,interfaceList,fileType) {
    try{
      let template = fs.readFileSync(dir+'/template/controller'+fileType+'txt').toString();
      let code = '';
      let parModelList = '';
      let resModelList = '';
      for(let i=0;i<interfaceList.length;i++){
        let prr = interfaceList[i].path.split('/');
        let methodName = prr[prr.length-1];
        let pModel ='iP'+interfaceList[i]._id;
        let rModel ='iR'+interfaceList[i]._id;
        let method = interfaceList[i].method.toLowerCase();
        code+='// '+interfaceList[i].title+" \n";
        code+='async '+method+'_'+methodName+'() { \n';
        code+='  const { ctx, service } = this;\n';
        code+='  let pars:'+pModel+' = this.getParams<'+pModel+'>();\n';
        code+='  let result:'+rModel+' = await this.getCache<'+rModel+'>();\n';
        code+='  if(result.code !==0 ){\n';
        code+='      return this.fail(result.code,result.msg);\n';
        code+='  }else{\n';
        code+='      if(result.data){\n';
        code+='          this.success(result.data);\n';
        code+='      }else{\n';
        code+='          result = await service.'+projectName+'.'+fname+'.'+method+'_'+methodName+'(pars);\n';
        code+='          if (result && result.code === 0) {\n';
        code+='             this.setCache(result.data);\n';
        code+='             this.success(result.data);\n';
        code+='          } else {\n';
        code+='            this.fail(ctx.code.HANDLE_ERROR, result.msg);\n';
        code+='          }\n';
        code+='      } \n';
        code+='  }\n';
        code+='}\n';
        if(parModelList!=''){
          parModelList+=',';
          resModelList+=',';
        }
        parModelList+=pModel;
        resModelList+=rModel;
      }
      while (template.indexOf('[CName]')>-1) {
        template = template.replace('[CName]',fname);
      }
      template = template.replace('[MethodList]',code);
      template = template.replace('[parModelList]', 'import {' +parModelList+' } from \'../parModel/'+projectName+'/'+fname+'\'');
      template = template.replace('[resModelList]', 'import {' +resModelList+' } from \'../resModel/'+projectName+'/'+fname+'\'' );
      if(fs.existsSync(path)){
        fs.rmSync(path);
      }
      fs.writeFileSync (path, template, 'utf8');
      console.log(path+' 生成成功');
      return 1;
    }catch(e){
      console.log("生成文件出错了，"+e);
      return 0;
    }
  }
}