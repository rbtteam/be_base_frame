export interface iver { 
    model: any;
    type: Array<Number>;    
}



export interface iMasterTable {
    model: any;       //表模型
    fileds:object,    //输入参数
    where:object,     //条件
    sourceKey:string, //主键字段
    order:object,     // 排序
}

export interface iExtTable{
    model: any;  //表模型
    type:Number, //表类型 1扩展 2子表
    fileds:object[], //插入值
    foreignKey:string, //外键字段
    sourceKey:string, //主键字段
    where:object,      //查询条件
    order?:object,      // 排序
}
// export interface iMasterTable {
//     primaryKey: string;
//     tableName:any,
//     fields:Array<{
//         fieldName:string,
//         fieldType:Number,
//         remark:string,
//         default:string,
//         needInput:Number,
//         ver:Array<{
//             ver:string,
//             val1:string,
//             val2:string,
//         }>,
//     }>,
//     order:Array<{
//         fieldName:string,
//         order:string,
//     }>
//     where:Array<{
//         fieldName:string,
//         oper:string,
//         value:string,
//     }>
// }

// export interface iExtTable{
//     type:Number,
//     tableName:string,
//     foreignKey:string,
//     fields:Array<{
//         fieldName:string,
//         fieldType:Number,
//         remark:string,
//         default:string,
//         needInput:Number,
//         ver:Array<{
//             ver:string,
//             val1:string,
//             val2:string,
//         }>,
//     }>,
//     order:Array<{
//         fieldName:string,
//         order:string,
//     }>
// }
   