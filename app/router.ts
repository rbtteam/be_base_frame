'use strict';
import { Application } from 'egg';
import baseframe_Router from "./router/baseframe_Router";
export default (app: Application) => {
   baseframe_Router(app);
};
