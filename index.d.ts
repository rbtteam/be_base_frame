declare module 'egg' {
    interface Application {
        parameters: any,
        Joi: any,
        enums: any,
        redis: any,
        Sequelize: any,
        model: any,  // eshop
        modelGlo:any,  // global
        modelDcc: any, // dcc

    }
    interface Context {
        request: Request & { params: any }
        params: any,

    }

}