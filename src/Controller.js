class Controller {
    constructor(resource){
        this.resource = resource;
        this.model = resource.model;

        this.index = this.index.bind(this);
        this.create = this.create.bind(this);
        this.show = this.show.bind(this);
        this.update = this.update.bind(this);
        this.destroy = this.destroy.bind(this);
    }

    async index(req, res) {
        let config = {
            
        }

        if(typeof this.resource.indexConfig === "function"){
            config = {
                ...config,
                ...this.resource.indexConfig(req)
            }
        }
        if(typeof this.resource.indexConfig === "object") {
            config = {
                ...config,
                ...this.resource.indexConfig
            }
        }
        
        try{
            const data = this.resource.withPagination ? await this.model.paginate(config) : await this.model.findAll(config);

            return res.send({
                resource: this.model.name,
                data 
            }).status(200);

        }catch(reason) {
            return res.send({
                message: "Internal server error",
            }).status(500);
        }
    }

    async create(req, res) {
        let model = new this.model();
        const attr = Object.keys(req.body);
        for (const key in attr) {
            const prop = attr[key];
            model[prop] = req.body[prop];
        }

        if(typeof this.resource.beforeCreate === 'function'){
            model = await this.resource.beforeCreate(model) || model;
        }
        try{
            await model.save();
        }catch(reason){
            if(reason.errors) {
                return res.send({
                    resource: this.model.name,
                    errors: reason.errors
                }).status(422);
            }
            return res.send({
                message: "Internal server error",
            }).status(500);
        }
        if(typeof this.resource.afterCreate === 'function'){
            model = await this.resource.beforeCreate(model) || model;
        }

        return res.send({
            resource: this.model.name,
            data:model
        }).status(201);
    }

    async show(req, res) {
        const {pk} = req.params;

        let config = {};
        if(typeof this.resource.showConfig === "function"){
            config = {
                ...config,
                ...this.resource.showConfig(req)
            }
        }
        if(typeof this.resource.showConfig === "object") {
            config = {
                ...config,
                ...this.resource.showConfig
            }
        }
        
        try{
            const model = await this.model.findByPk(pk, config);
            
            if(!model) {
                return res.send({
                    message: "Not found"
                }).status(404);
            }
            
            return res.send({
                resource: this.model.name,
                data:model
            }).status(200);
        }catch(reaseon) {
            return res.send({
                message: "Internal server error",
            }).status(500);
        }

    }

    async update(req, res) {
        const {pk} = req.params;
        const model = await this.model.findByPk(pk);
        const attr = Object.keys(req.body);
        for (const key in attr) {
            const prop = attr[key];
            model[prop] = req.body[prop];
        }


        if(typeof this.resource.beforeUpdate === 'function'){
            model = await this.resource.beforeUpdate(model) || model;
        }
        try{
            await model.save();
        }catch(reason){
            if(reason.errors) {
                return res.send({
                    resource: this.model.name,
                    errors: reason.errors
                }).status(422);
            }
            return res.send({
                message: "Internal server error",
            }).status(500);
        }
        if(typeof this.resource.afterUpdate === 'function'){
            model = await this.resource.beforeUpdate(model) || model;
        }

        return res.send({
            resource: this.model.name,
            data:model
        }).status(200)
    }

    async destroy(req, res) {
        const {pk} = req.params;
        const model = await this.model.findByPk(pk);

        if(!model) {
            return res.send({
                message: "Not found"
            }).status(404);
        }

        await model.destroy();

        return res.sendStatus(204);
    }

}

module.exports = Controller