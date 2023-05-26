import axios, { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios'
import * as fs from 'fs';
import genCodeController from '../src/genControllerCode';
import genCodePar from '../src/genParCode';
import genCodeModel from './genParModel';
import genServiceCode from '../src/genServiceCode';
import genResultModel from '../src/genResultModel';
import genIserviceCode from '../src/genIserviceCode';
import genRouter from '../src/genRouter';
import * as json5 from 'json5';
import configModel from '../src/config';
import utils from '../src/utils';

export default class index{
  json_parse(json) {
    try {
      return json5.parse(json)
    } catch (err) {
      return null;
    }
  }
  
  errLog(message) {
    console.log(message)
    process.exit(1)
  }
  
  async getProjectInfo(config) {
    let result;
    try {
      result = await axios.get(`${config.server}/api/project/get?token=${config.token}`)
    } catch (e) {
      this.errLog('请求 /api/project/get 失败，请检查网络或 token')
    }
    return result.data.data;
  }
  
  async getCatMenu(config) {
    let result;
    try {
      result = await axios.get(`${config.server}/api/interface/getCatMenu?token=${config.token}`)
    } catch (e) {
      this.errLog('请求 /api/project/get 失败，请检查网络或 token')
    }
    return result.data.data;
  }
  
  async getInterfaceList(config, catid) {
    let result;
    try {
      result = await axios.get(
        `${config.server}/api/interface/list_cat?catid=${catid}&page=1&limit=10000&token=${config.token}`
      );
  
    } catch (err) {
      this.errLog('调用 /api/interface/list 失败，请检查网络或 token')
    }
  
    return result.data.data.list;
  }
  async gen(options:any,arg) {
    let routerList:Array<string> = [];
    let config = new configModel();
    for (let pi = 0; pi < (options.projects || []).length; pi++) {
      let project = options.projects[pi];
      Object.assign( config, project);
      const projectData = await this.getProjectInfo(config);
      const catMenu = await this.getCatMenu(config);
      if (catMenu) {

        for (let j = 0; j < catMenu.length; j++) {
          if(project.cats.length > 0 && !project.cats.find(item => item === catMenu[j]._id)) {
            continue
          }
          let routercode ='';
          let catName = catMenu[j].name;
          let fields = [
            '_id',
            'title',                   // 标题
            'path',                    // 路径
            'method',                  // 提交方式
            'req_params',              // 请求参数
            'req_query',               // 
            'req_headers',
            'req_body_type',
            'req_body_is_json_schema',
            'req_body_form',
            'req_body_other',
            'res_body_type',            // 返回数据type
            'res_body_is_json_schema',  // 返回数据结构是否为json-schema
            'res_body',                 // 返回数据内容
            'markdown',                 // 备注
          ];
          const list = await this.getInterfaceList(config, catMenu[j]._id);
          let interfaceDatas = [] as any;
          for (let i = 0; i < list.length; i++) {
            let result = await axios.get(
              `${config.server}/api/interface/get?id=${list[i]._id}&token=${config.token}`
            );
            let interfaceData = result.data.data;
            interfaceData =new utils().getDataByFields(interfaceData, fields);
            //console.log(interfaceData._id);
            interfaceData.req_body_other = this.json_parse(interfaceData.req_body_other);
            
            interfaceData.path = projectData.basepath + interfaceData.path;
            interfaceDatas.push(interfaceData);
          }
          let fileType = options.fileType;
          if (interfaceDatas.length > 0) {

            if(options.buildType=='be'){
              //后端代码生成 
              if(arg && (arg ==='all' || arg === projectData.name + "/" + catMenu[j].name)){
              //处理生成 controller文件
              let filePathController = config.dist + "/" + config.saveDirName + '/controller/' + projectData.name + "/" + catMenu[j].name + fileType;
              await this.mkdir(config.dist + "/" + config.saveDirName + '/controller/' + projectData.name)
              new genCodeController().genCodeController(filePathController, config.dist, projectData.name, catMenu[j].name, interfaceDatas,fileType);
  
  
              //处理生成 Controller / parameters 校验
              let filePathPar = config.dist + "/" + config.saveDirName + '/controller/parameters/' + projectData.name + "/" + catMenu[j].name + fileType;
              await this.mkdir(config.dist + "/" + config.saveDirName + '/controller/parameters/' + projectData.name)
              new genCodePar().genCode(filePathPar, config.dist, catMenu[j].name, interfaceDatas,fileType);

              // 生成Controller parameters model
              let filePathParModel = config.dist + "/" + config.saveDirName + '/controller/parModel/' + projectData.name + "/" + catMenu[j].name + fileType;
              await this.mkdir(config.dist + "/" + config.saveDirName + '/controller/parModel/' + projectData.name)
              new genCodeModel().genCode(filePathParModel, config.dist, catMenu[j].name, interfaceDatas,fileType);
  
              
                // 处理生成 service文件 api
                let filePathService = config.dist + "/" + config.saveDirName + '/service/' + projectData.name + "/" + catMenu[j].name + fileType;
                await this.mkdir(config.dist + "/" + config.saveDirName + '/service/' + projectData.name)
                new genServiceCode().genCode(filePathService, config.dist, projectData.name,catMenu[j].name, interfaceDatas,fileType);
            

              // //处理生成 service文件  resModel
              let filePathServiceModel = config.dist + "/" + config.saveDirName + '/controller/resModel/' + projectData.name + "/" + catMenu[j].name + fileType;
              await this.mkdir(config.dist + "/" + config.saveDirName + '/controller/resModel/' + projectData.name)
              new genResultModel().genCode(filePathServiceModel, config.dist, catMenu[j].name, interfaceDatas,fileType);

              // // //处理生成 service文件  Iservice
              // let filePathIService = config.dist + "/" + config.saveDirName + '/service/iService/' + projectData.name + "/" + catMenu[j].name + fileType;
              // await this.mkdir(config.dist + "/" + config.saveDirName + '/service/iService/' + projectData.name)
              // new genIserviceCode().genCode(filePathIService, config.dist,projectData.name,catMenu[j].name, interfaceDatas,fileType);
             }
             if(arg && (arg ==='all' )){
              // 组装路由代码
                await this.mkdir(config.dist + "/" + config.saveDirName + '/router');
                routercode+=new genRouter().build(projectData.name,interfaceDatas,catMenu[j].name);

               //生成子Router文件
               let filePathService = config.dist + "/" + config.saveDirName + '/router/'  + catName + "_Router.ts";
               routerList.push(catName + '_Router');
               new genRouter().genRouter(filePathService, config.dist,routercode);
              }
            }
            
  
          } else {
            console.log(catMenu[j].name + "无api列表");
          }
        }
        /*if(arg && (arg ==='all' )){
          //生成子Router文件
          let filePathService = config.dist + "/" + config.saveDirName + '/router/' + projectData.name + "_Router.ts";
          routerList.push(projectData.name + '_Router');
          new genRouter().genRouter(filePathService, config.dist,routercode);
        }*/
  
      } else {
        console.log('获取catMenu出错,' + catMenu.errmsg);
      }
    }
    if(arg && (arg ==='all' )){
      // 生成router 根文件
      // new genRouter().genRouTerList(routerList,config.dist+'/app/router.ts');
    }
  
  }
  
  mkdir(folderpath) {
    try {
      const pathArr = folderpath.split('/');
      let _path = '';
      for (let i = 0; i < pathArr.length; i++) {
        if (pathArr[i]) {
          _path += `${pathArr[i]}/`;
          if (!fs.existsSync(_path)) {
            fs.mkdirSync(_path);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  
}



