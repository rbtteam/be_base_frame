'use strict';
import Service from '../baseService';
import _ = require('lodash');
import {iP11893,iP10149,iP11901,iP11885 } from '../../controller/parModel/baseframe/base';
import {iR11893,iR10149,iR11901,iR11885 } from '../../controller/resModel/baseframe/base';
//#region import


//#endregion import

export default  class baseService extends Service {
//#region genCode 
async get_demoInfo(pars:iP11893) { 
  let resultJson:iR11893 = {
     code:0, 
     data:{ 
     },
     msg:'', 
  };
  //ToDo 实现后请删除本行注释
  //return this.error<iR11893>(resultJson,'出错了');
  return resultJson;
}
async post_demoAdd(pars:iP10149) { 
  let resultJson : iR10149 ={
    code:0, 
     data:{ 
     },
     msg:'', 
  }
  return resultJson;
  
}
async post_demoUpdate(pars:iP11901) { 
  let resultJson:iR11901 = {
     code:0, 
     data:{ 
     },
     msg:'', 
  };
  //ToDo 实现后请删除本行注释
  //return this.error<iR11901>(resultJson,'出错了');
  return resultJson;
}
async get_demoList(pars:iP11885) { 
  let resultJson:iR11885 = {
     code:0, 
     data:{ 
     },
     msg:'', 
  };
  //ToDo 实现后请删除本行注释
  //return this.error<iR11885>(resultJson,'出错了');
  return resultJson;
}

//#endregion
//#region achieve 
 
 
 




//#endregion achieve
}
