'use strict';

import Controller from '../baseController';
import {iP11893,iP10149,iP11901,iP11885 } from '../parModel/baseframe/base';
import {iR11893,iR10149,iR11901,iR11885 } from '../resModel/baseframe/base';
export default class baseController extends Controller {

// demoInfo 
async get_demoInfo() { 
  const { ctx, service } = this;
  let pars:iP11893 = this.getParams<iP11893>();
  let result:iR11893 = await this.getCache<iR11893>();
  if(result.code !==0 ){
      return this.fail(result.code,result.msg);
  }else{
      if(result.data){
          this.success(result.data);
      }else{
          result = await service.baseframe.base.get_demoInfo(pars);
          if (result && result.code === 0) {
             this.setCache(result.data);
             this.success(result.data);
          } else {
            this.fail(ctx.code.HANDLE_ERROR, result.msg);
          }
      } 
  }
}
// demoAdd 
async post_demoAdd() { 
  const { ctx, service } = this;
  let pars:iP10149 = this.getParams<iP10149>();
  let result:iR10149 = await this.getCache<iR10149>();
  if(result.code !==0 ){
      return this.fail(result.code,result.msg);
  }else{
      if(result.data){
          this.success(result.data);
      }else{
          result = await service.baseframe.base.post_demoAdd(pars);
          if (result && result.code === 0) {
             this.setCache(result.data);
             this.success(result.data);
          } else {
            this.fail(ctx.code.HANDLE_ERROR, result.msg);
          }
      } 
  }
}
// demoUpdate 
async post_demoUpdate() { 
  const { ctx, service } = this;
  let pars:iP11901 = this.getParams<iP11901>();
  let result:iR11901 = await this.getCache<iR11901>();
  if(result.code !==0 ){
      return this.fail(result.code,result.msg);
  }else{
      if(result.data){
          this.success(result.data);
      }else{
          result = await service.baseframe.base.post_demoUpdate(pars);
          if (result && result.code === 0) {
             this.setCache(result.data);
             this.success(result.data);
          } else {
            this.fail(ctx.code.HANDLE_ERROR, result.msg);
          }
      } 
  }
}
// demoList 
async get_demoList() { 
  const { ctx, service } = this;
  let pars:iP11885 = this.getParams<iP11885>();
  let result:iR11885 = await this.getCache<iR11885>();
  if(result.code !==0 ){
      return this.fail(result.code,result.msg);
  }else{
      if(result.data){
          this.success(result.data);
      }else{
          result = await service.baseframe.base.get_demoList(pars);
          if (result && result.code === 0) {
             this.setCache(result.data);
             this.success(result.data);
          } else {
            this.fail(ctx.code.HANDLE_ERROR, result.msg);
          }
      } 
  }
}


}

