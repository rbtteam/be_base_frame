

import { any, string } from 'joi';
import * as path from 'path';


export default class config {
  controller_template: string = 'controller.js';
  service_template: string  = 'service.js';
  server: string  = '';
  token:string = '项目token';
  dist:string  = "''";
  enableValidte:boolean = true;
  saveDirName:string = "";
  constructor(){
    this.dist = path.resolve(process.cwd());
  }
}
