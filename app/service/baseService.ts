'use strict';
import { Service } from 'egg';
import { iver, iExtTable, iMasterTable } from './baseInterface';
import { string } from "joi";

export type AddOrUpdateBeforeCallback = (tableName: string, isAdd: boolean, fields: any) => void;

/**
 * BaseController
 */
export default class BaseService extends Service {

    /**
     * 用户信息
     */
    get user() {
        return this.ctx.state.oauth.token.user;
    }

    get token() {
        return this.ctx.state.oauth.token.accessToken;
    }

    /**
     * 客户端信息
     */
    get client() {
        return this.ctx.state.oauth.token.client;
    }

    /**
     * 供货商角色信息
     */
    get supplier() {
        return this.getRoleInfo(1);
    }

    /**
     * 代理商角色信息
     */
    get agent() {
        return this.getRoleInfo(2);
    }

    /**
     * 会员用户信息
     */
    get customerUser() {
        return this.getRoleInfo(3);
    }

    getRoleInfo(type: number) {
        let result = null;

        switch (type) {
            case 1:
                result = this.user.supplier;
                break; // 供货商
            case 2:
                result = this.user.agent;
                break; // 代理商
            case 3:
                result = this.user.customerUser;
                break; // 会员
            default:
                break;
        }
        return result;
    }

    //出错了
    error(msg: any) {
        return {
            code: 5,
            msg: msg,
            data: {}
        }
    }

    // 出错了
    public errorT<T>(par: T, msg: string): T {
        par["msg"] = msg;
        par["code"] = 5;
        return par;
    }

    //成功返回
    success(obj: any) {
        return {
            code: 0,
            data: obj,
            msg: ''
        }
    }
    //出错了
    Rerror(msg: string) {
        return {
            code: 5,
            data: {},
            msg: msg
        }
    }

    //成功返回
    Rsuccess(obj) {
        return {
            code: 0,
            data: obj,
            msg: ''
        }
    }
    //校验商户权限范围验证
    async Verify(ver: iver) {
        let verResult = {
            status: true,
            msg: '',
        }
        if (ver && ver.model && ver.type && ver.type.length > 0) {
            for (let i = 0; i < ver.type.length; i++) {
                switch (ver.type[i]) {
                    case 1:
                        if (ver.model["MerchantID"] && parseInt(ver.model["MerchantID"]) !== this.user.MerchantID) {
                            verResult.status = false;
                            verResult.msg = '商户编号不一致';
                        }
                        break;
                    case 2:
                        if (ver.model["ShopID"] && parseInt(ver.model["ShopID"]) !== this.user.ShopID) {
                            verResult.status = false;
                            verResult.msg = '店铺编号不一致';
                        }
                        break;
                    case 3:
                        if (parseInt(ver.model["CustomerID"]) !== this.user.CustomerID) {
                            verResult.status = false;
                            verResult.msg = '用户编号不一致';
                        }
                        break;
                }
            }
        }
        return verResult;

    }
    //创建  
    async standardAdd(MasterTable: iMasterTable, ExtTable: Array<iExtTable>, ver: iver) {
        let verResult = await this.Verify(ver);
        if (verResult.status) {
            const transaction = await MasterTable.model.sequelize.transaction();
            try {
                await MasterTable.model.createByForm(MasterTable.fileds, transaction);
                for (let i = 0; i < ExtTable.length; i++) {
                    await ExtTable[i].model.createByForm(ExtTable[i].fileds, transaction);
                }
                await transaction.commit();
                let data = {};
                data[MasterTable.sourceKey] = MasterTable.fileds[MasterTable.sourceKey];
                return this.Rsuccess(data);
            } catch (err: any) {
                await transaction.rollback();
                this.ctx.logger.error(err);
                return this.Rerror(err.message);
            }
        } else {
            return this.Rerror(verResult.msg);
        }
    }

    //创建或修改
    async standardAddOrUpdate(MasterTable: iMasterTable, ExtTable: Array<iExtTable>, ver: iver, beforeCallback: AddOrUpdateBeforeCallback) {
        let verResult = await this.Verify(ver);

        if (verResult.status) {
            const transaction = await MasterTable.model.sequelize.transaction();
            try {
                await this.handleAndOrUpdate(MasterTable.model, MasterTable.sourceKey, MasterTable.fileds, transaction, beforeCallback);
                let pkValue = MasterTable.fileds[MasterTable.sourceKey];

                for (let i = 0; i < ExtTable.length; i++) {
                    if (ExtTable[i].type == 2) {
                        for (let j = 0; j < ExtTable[i].fileds.length; j++) {
                            let data = ExtTable[i].fileds[j];
                            if (!data[ExtTable[i].foreignKey]) {
                                data[ExtTable[i].foreignKey] = pkValue;
                            }
                            await this.handleAndOrUpdate(ExtTable[i].model, ExtTable[i].sourceKey, data, transaction, beforeCallback);
                        }
                    } else if (ExtTable[i].type == 1) {
                        let data = ExtTable[i].fileds;
                        if (!data[ExtTable[i].foreignKey]) {
                            data[ExtTable[i].foreignKey] = pkValue;
                        }
                        await this.handleAndOrUpdate(ExtTable[i].model, ExtTable[i].sourceKey, data, transaction, beforeCallback);
                    }

                }
                await transaction.commit();
                let data = {};
                data[MasterTable.sourceKey] = MasterTable.fileds[MasterTable.sourceKey];
                return this.Rsuccess(data);
            } catch (err: any) {
                await transaction.rollback();
                this.ctx.logger.error(err);
                return this.Rerror(err.message);
            }
        } else {
            return this.Rerror(verResult.msg);
        }
    }

    async findByColumn(model: any, colName: string, data: any) {
        if (!data[colName]) {
            return null;
        }
        let where = {};
        where[colName] = data[colName];
        return await model.findOne({ where: where });
    }

    async updateByColumn(model: any, colName: string, data: any, transaction: any) {
        let where = {};
        where[colName] = data[colName];
        await model.update(data, { where: where }, { transaction });
    }

    async handleAndOrUpdate(model: any, sourceKey: string, fields: any, transaction: any, beforeCallback: AddOrUpdateBeforeCallback) {
        let om = await this.findByColumn(model, sourceKey, fields);
        if (!om) {
            beforeCallback(model.tableName, true, fields);
            await model.createByForm(fields, transaction);
        } else {
            beforeCallback(model.tableName, false, fields);
            await this.updateByColumn(model, sourceKey, fields, transaction);
        }
    }

    //标准修改
    async standardUpdate(MasterTable: iMasterTable, ExtTable: Array<iExtTable>, verTypes: iver, childWhere?: any) {
        if (!MasterTable.where) {
            return this.Rerror('条件不允许为空');
        }
        let om = await MasterTable.model.findOne({
            where: MasterTable.where,
        });
        if (!om) {
            return this.Rerror('没有可修改的数据');
        }
        let ver = await this.Verify(verTypes);
        if (ver.status) {
            const transaction = await MasterTable.model.sequelize.transaction();
            try {
                await MasterTable.model.update(MasterTable.fileds, { where: MasterTable.where }, { transaction });
                let children = ExtTable.filter(item => {
                    return item.type === 2
                })
                if (children && children.length > 0) {
                    await children[0].model.destroy({ where: childWhere }, { transaction });
                }
                for (let i = 0; i < ExtTable.length; i++) {
                    await ExtTable[i].model.createByForm(ExtTable[i].fileds, transaction);
                }
                await transaction.commit();
                return this.Rsuccess('');
            } catch (error: any) {
                await transaction.rollback();
                this.ctx.logger.error(error);
                return this.Rerror(error.message);
            }
        } else {
            return this.Rerror(ver.msg);
        }
    }
    // 获取单条信息 
    async standardInfo(MasterTable: iMasterTable, ExtTable: Array<iExtTable>, verTypes: iver) {
        if (!MasterTable.where) {
            return this.Rerror('条件不允许为空');
        }
        let include = [] as any;
        let extT = ExtTable.filter(item => {
            return item.type === 1
        })
        for (let i = 0; i < extT.length; i++) {
            let item = {
                association: MasterTable.model.hasOne(extT[i].model, { foreignKey: extT[i].foreignKey, sourceKey: extT[i].sourceKey || MasterTable.sourceKey }),
                where: extT[i].where,
                raw: true,
            }
            include.push(item);
        }
        let om = await MasterTable.model.findOne({
            where: MasterTable.where,
            include: include,
            raw: true,
        });
        if (!om) {
            return this.Rerror("请求数据为空！");
        };
        let ver = await this.Verify(verTypes);
        if (ver.status) {
            let children = ExtTable.filter(item => {
                return item.type === 2
            })
            if (children && children.length > 0) {
                for (let j = 0; j < children.length; j++) {
                    children[j].where[children[j].foreignKey] = children[j].sourceKey ? om[children[j].sourceKey] : om[MasterTable.sourceKey];
                    let chd = await children[j].model.findAll({
                        where: children[j].where,
                        raw: true,
                    });
                    chd.forEach(item => {
                        this.formtData(item);
                    })
                    om[children[j].model.tableName] = chd;
                }

            }
            this.formtData(om);
            return this.Rsuccess(om);
        } else {
            return this.Rerror(ver.msg);
        }
    }

    // 获取列表 
    async standardList(MasterTable: iMasterTable, ExtTable: Array<iExtTable>, verTypes: iver, limit, offset) {
        if (!MasterTable.where) {
            return this.Rerror('条件不允许为空');
        }
        let include = [] as any;
        let keys = [] as any;
        let extT = ExtTable.filter(item => {
            return item.type === 1
        })
        for (let i = 0; i < extT.length; i++) {
            for (let i = 0; i < extT.length; i++) {
                let item = {
                    association: MasterTable.model.hasOne(extT[i].model, { foreignKey: extT[i].foreignKey, sourceKey: extT[i].sourceKey || MasterTable.sourceKey }),
                    where: extT[i].where,
                    raw: true,
                }
                include.push(item);
            }
        }
        let om = await MasterTable.model.findAndCountAll({
            where: MasterTable.where,
            include: include,
            order: MasterTable.order,
            limit: limit,
            offset: offset,
            raw: true,
        });
        let verResult = await this.Verify(verTypes);
        if (verResult.status) {
            let children = ExtTable.filter(item => {
                return item.type === 2
            })
            if (children && om && om.count > 0) {
                const Op = this.app.Sequelize.Op;
                om.rows.map(item => {
                    this.formtData(item);
                    keys.push(item[MasterTable.sourceKey]);
                });
                for (let j = 0; j < children.length; j++) {
                    children[j].where[children[j].foreignKey] = {
                        [Op.in]: keys
                    };
                    let childList = await children[j].model.findAndCountAll({
                        where: children[j].where,
                        order: children[j].order || [],
                        raw: true,
                    });
                    childList.rows.map(item => {
                        this.formtData(item);
                    })
                    om.rows.map(item => {
                        item[children[j].model.tableName] = (childList.rows || []).filter(e => {
                            return e[children[j].foreignKey] && e[children[j].foreignKey] === item[MasterTable.sourceKey]
                        })
                    })
                }

            }
            return this.Rsuccess(om);
        } else {
            return this.Rerror(verResult.msg);
        }
    }


    formtData(item) {
        if (!item) {
            return;
        }
        if (item["CreatedAt"]) {
            item.CreatedAt = item.CreatedAt.getTime();
        }
        if (item["UpdatedAt"]) {
            item.UpdatedAt = item.UpdatedAt.getTime();
        }
    }

    /**
     * 新增或修改，根据主键列名查找数据是更新还是修改
     * @param model
     * @param pkColName
     * @param data
     * @param otherColNames
     */
    async addOrUpdate(model: any, pkColName: string, data: any[], otherColNames: string[] = []) {
        const transaction = await model.sequelize.transaction();
        let self = this;
        async function add(item) {
            let verResult = await self.Verify({ model: item, type: [] });
            if (verResult.status) {
                await model.createByForm(item, transaction);
                return null;
            } else {
                return self.Rerror(verResult.msg);
            }
        }

        try {
            for (const item of data) {
                const where = {};
                if (item[pkColName]) {
                    where[pkColName] = item[pkColName];
                }
                otherColNames.forEach(colName => where[colName] = item[colName]);

                if (item[pkColName] || otherColNames.length > 0) { // 有where条件
                    let om = await model.findOne({ where: where });
                    if (!om) {
                        let result = await add(item);
                        if (result) {
                            return result;
                        }
                    } else {
                        item[pkColName] = item[pkColName] || om[pkColName];
                        await model.update(item, { where: where }, { transaction });
                    }
                } else { // 无where条件新增
                    let result = await add(item);
                    if (result) {
                        return result;
                    }
                }
            }

            await transaction.commit();
            return this.Rsuccess('');
        } catch (err: any) {
            await transaction.rollback();
            this.ctx.logger.error(err);
            return this.Rerror(err.message);
        }
    }

    /**
     * 给数据附加UpdatedAt字段
     * @param data
     * @param other
     */
    appendUpdateAt(data: any[], other: object = {}) {
        data.forEach(item => {
            item['UpdatedAt'] = new Date();
            for (const key in other) {
                if (!item[key]) {
                    item[key] = other[key];
                }
            }
        });
        return data;
    }
}