import MPService = require('./app/service/mp');
import WCSService = require('./app/service/wcs');
import SignService = require('./app/service/sign');
import WcopService = require('./app/service/wcop');
declare module 'egg' {
  // extend service
  interface IService {
    mp: MPService;
    wcs: WCSService;
    sign: SignService,
    wcop: WcopService,
  }
}