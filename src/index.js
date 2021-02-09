const router = require('express').Router();
const bodyParser = require('body-parser');

const sequelizePaginate = require('sequelize-paginate');
const Controller = require('./Controller');

router.use(bodyParser.json()) // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true }))

const defaultConfig = {
    basePath:'/api'
}

function CrudGenerator(resources = [], config = defaultConfig) {
    this.resources = resources;
    this.config = config;
}

CrudGenerator.prototype.generateModelConfig = function(model) {
    sequelizePaginate.paginate(model);
    return {
        model,
        path: model.tableName.replace(/_/g,"-"),
        withPagination:true,
        indexConfig: {},
        showConfig: {},

        beforeCreate: null,
        beforeUpdate: null,
        afterCreate: null,
        afterUpdate: null,

        protection: (_,__,next) => next(),
        indexProtection: [],
        showProtection: [],
        createProtection: [],
        updateProtection: [],
        destroyProtection: []
    }
} 

CrudGenerator.prototype.router = function () {
    for (const key in this.resources) {
            let resource = this.resources[key];
            if(typeof resource === 'function'){
                resource = this.generateModelConfig(resource);
            }
            else if(typeof resource === 'object'){
                resource = {
                    ...this.generateModelConfig(resource.model),
                    ...resource
                }
            }
            else throw new TypeError('The resources should be typeof function or object');

            const controller = new Controller(resource);

            router.use(`/${resource.path}`, resource.protection);
            router.get(`/${resource.path}`, resource.indexProtection ,controller.index)
            router.get(`/${resource.path}/:pk`, resource.showProtection ,controller.show)
            router.post(`/${resource.path}`, resource.createProtection ,controller.create)
            router.put(`/${resource.path}/:pk`, resource.updateProtection ,controller.update)
            router.delete(`/${resource.path}/:pk`, resource.destroyProtection ,controller.destroy)
    }

    return router;
}


module.exports = CrudGenerator;