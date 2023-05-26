import * as fs from 'fs';

export default class Roture {
    genRouter (path,dir,content) {
        try{
          let template = fs.readFileSync(dir+'/template/router.tstxt').toString();
          let code = '';
          template = template.replace('[List]',content);
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
    
    build (came,interfaceList,fname){
        let code = '';
        let roleValidate='';        
        for(let i=0;i<interfaceList.length;i++){
            let prr = interfaceList[i].path.split('/');
            let methodName = prr[prr.length-1];
            let method = interfaceList[i].method.toLowerCase();
            code+='    // '+interfaceList[i].title+" \n";
            code+='    router.'+method+'(\''+interfaceList[i].path+'\', requestValidate()'+roleValidate+', controller.'+came+'.'+fname+'.'+method+'_'+methodName+');\n';
        }
        return code;
    }

    genRouTerList(list,path){
      try{
        let template = '\'use strict\';\n';
        template += 'import { Application } from \'egg\';\n';
        let url='';
        let link='';
        for(let i=0;i<list.length;i++){
          url += 'import '+list[i]+' from "./router/'+list[i]+'";\n';
          link += '   '+list[i]+'(app);\n';
        }
        template += url;
        template += 'export default (app: Application) => {\n';
        template += link;
        template += '};\n'
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