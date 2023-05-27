'use strict';
import { Application } from 'egg';
import baseframe_base_Router from "./router/baseframe_base_Router";
export default (app: Application) => {
   baseframe_base_Router(app);
};
