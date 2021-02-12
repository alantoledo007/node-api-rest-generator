const router = require('express').Router();
const bodyParser = require('body-parser');

const sequelizePaginate = require('sequelize-paginate');
const Controller = require('./Controller');

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true }));

const defaultConfig = {
    basePath:'/api',
    middlewares: [],
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
        beforeDestroy: null,
        afterCreate: null,
        afterUpdate: null,
        afterDestroy: null,

        middlewares: [],
        
        indexProtection: [],
        showProtection: [],
        createProtection: [],
        updateProtection: [],
        destroyProtection: [],

        onlyMethods: [],
        exceptMethods: []
    }
} 

CrudGenerator.prototype.router = function () {
    for (const key in this.config.middlewares) {
        const middleware = resource.middlewares[key];
        router.use(middleware);
    }
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

            let methods = ['index','create','show','update','destroy'];
            if(resource.onlyMethods.length && resource.exceptMethods.length) throw TypeError('You can choose between onlyMethods or exceptMethods, but not both');
            if(resource.onlyMethods.length) methods = resource.onlyMethods;
            if(resource.exceptMethods.length) {
                for (let i = 0; i < resource.exceptMethods.length; i++) {
                    methods.filter(item => item != resource.exceptMethods[i]);
                }
            }
            const controller = new Controller(resource);

            for (const key in resource.middlewares) {
                const middleware = resource.middlewares[key];
                router.use(`/${resource.path}`, middleware);
            }
            if(methods.includes('index')) router.get(`/${resource.path}`, resource.indexProtection ,controller.index);
            if(methods.includes('show')) router.get(`/${resource.path}/:pk`, resource.showProtection ,controller.show);
            if(methods.includes('create')) router.post(`/${resource.path}`, resource.createProtection ,controller.create);
            if(methods.includes('update')) router.put(`/${resource.path}/:pk`, resource.updateProtection ,controller.update);
            if(methods.includes('destroy')) router.delete(`/${resource.path}/:pk`, resource.destroyProtection ,controller.destroy);
    }

    return router;
}


module.exports = CrudGenerator;