#!/usr/bin/env node

import * as path from 'path';
const option = require(path.resolve(process.cwd(), 'yapi-gen.config.js'))
import { argv } from 'process';
import core from '../src/index';

var _ = require('lodash');
let argv2 = argv[2];
// console.log(argv2);
// let data = [
// {productname:'111',orderid:1},{productname:'2222',orderid:2},{productname:'2222',orderid:322},{productname:'3333',orderid:2}
// ];
// let list =  _.groupBy(data,'productname');
// for (let item in list) {
//    console.log(item);
// }
new core().gen(option,argv2).then(()=>{
  console.log('Done')
}).catch(err=>{
  console.error(err)
})
