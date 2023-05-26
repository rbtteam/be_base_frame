import allConfig from '../config/config.local';
const { sequelize: config } = allConfig({ name: '' } as any);
import * as fs from 'fs';
import * as path from 'path';
import { argv } from 'process';
import * as  _ from 'lodash';
import sequelizeAuto from 'sequelize-auto';



let dbConfig = config;
if(config.datasources && config.datasources.length>0){
    dbConfig = config.datasources[0];
    for(let i=0;i<config.datasources.length;i++){
        dbConfig = config.datasources[i];
        let smallDbName = config.datasources[i].delegate.replace('model','');
        //创建目录
        try {
            let _path = path.resolve(process.cwd())+'/app/model'+smallDbName;
            fs.mkdirSync(_path);
        } catch (e) {
            console.log(e);
        }
        try {
            let _path = path.resolve(process.cwd())+'/app/schema'+smallDbName;
            fs.mkdirSync(_path);
        } catch (e) {
            console.log(e);
        }

        //生成代码
        const sequelizeConfig = Object.assign(dbConfig, {
            directory: false,
            additional: {
                timestamps: false
            },
            // lang: 'ts'
        });
        
        
        const auto = new sequelizeAuto(dbConfig.database, dbConfig.username, dbConfig.password, sequelizeConfig);
        auto.run().then((data: any) => {

            for (const key in data.text) {
        
                fs.writeFileSync(path.join(`./app/schema${smallDbName}`, `${key}.ts`), data.text[key]);
        
                if (Object.hasOwnProperty.call(data.text, key)) {
                    const tableTextArr = data.text[key].replace(/  /g, '    ').replace(/sequelize,/g, '').split('\n');
                    tableTextArr.splice(0, 3);
                    tableTextArr.splice(tableTextArr.length - 2, 1);
                    tableTextArr.push(...[
                        `    ${key}.associate = function() {`,
                        '\n',
                    ]);
                    // associate
                    // 被关联的键
        
                    for (let index = 0; index < data.relations.length; index++) {
                        const rel = data.relations[index];
                        if (rel.parentModel === key) {
                            const hasStr = rel.isM2M ? 'Many' : 'One';
                            tableTextArr.push(`        ${key}.has${hasStr}(app.model${smallDbName}.${rel.childModel}, { foreignKey: '${rel.parentId}' });`);
                        }
        
                        if (rel.childModel === key) {
                            const hasStr = rel.isM2M ? 'Many' : '';
                            tableTextArr.push(`        ${key}.belongsTo${hasStr}(app.model${smallDbName}.${rel.parentModel}, { foreignKey: '${rel.parentId}' });`);
                        }
                    }
                    tableTextArr.push(...[
                        '   };',
                        `    return ${key};`, '};'
                    ]);
        
                    const fileStart = [
                        "'use strict';",
                        "import { Application } from 'egg';",
                        'export default (app: Application) => {',
                        '    const DataTypes = app.Sequelize;',
                        `    const ${key}: any = app.model${smallDbName}.define('${key}', {`,
                    ];
        
        
                    const fileContent = fileStart.concat(tableTextArr).join('\n');
                    fs.writeFileSync(path.join(`./app/schema${smallDbName}`, `${key}.ts`), fileContent);
        
                    const modelPath = path.join(`./app/model${smallDbName}`, `${key}.ts`);
                    // 判断是否存在model
                    if (!fs.existsSync(modelPath)) {
                        let keyModel = key + 'Model';
                        const modelText = [
                            "'use strict';",
                            "import { Application } from 'egg';",
                            `import  ${key} from '../schema${smallDbName}/${key}';
                                        `,
                            'export default (app: Application) => {',
                            `     let ${keyModel}:any = ${key}(app);
                                  
                                        `,
                        ];
        
        
                        const primaryKey = _.findKey(data.tables[key], { 'primaryKey': true });
                        if (primaryKey) {
                            modelText.push(...[
                                `    ${keyModel}.getMaxId = async function() {`,
                                `        return await this.max('${_.findKey(data.tables[key], { 'primaryKey': true })}') || 0;`,
                                `    };`,
                            ]);
                        }
                        modelText.push(...[
                            `    return ${keyModel};`,
                            `};`
                        ]);
        
        
                        fs.writeFileSync(modelPath, modelText.join('\n'));
                    }
                }
            }
        });
    }
}





