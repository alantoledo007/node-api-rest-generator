# API REST GENERATOR

Know can you create an API REST with only 2 code lines? It's posible thanks to this package! TRY NOW.

## INSTALLATION

```bash

npm install api-rest-generator

o

yarn add api-rest-generator
```

## REQUISITES

- Sequelize
- Express

## FEATURES
- Create multiple CRUD in seconds with the pagination solved.
- You can disable pagination.
- Create an API REST automatically.
- Data validators (Sequelize).
- Customizable (paths & methods).
- Implement your middlewares on each path or method.
- Not necessarily should create a CRUD. You define which methods to use and which not. (onlyMethods & exceptMethods).

## EXAMPLE

``` javascript
//api-rest-generator
const ApiRestGenerator = require('api-rest-generator');

//express
const express = require('express');
const server = express();
const port = 3000;

//import your Sequelize models
const { User, Post, Comment } = require('./models');

//configure your resources.
const resources = [
    User,
    {
        model: Post,
        path: 'articles',
        indexConfig:{
            include: 'comments'
        }
    },
    Comment
]

//package options
const config = {
    basePath: '/api',
    middlewares: [],

    /*
        for example:
            middleware: [foo(), bar()]

        result:
            router.use(middleware[0]);
            router.use(middleware[1]);
    */
}

const apigen = new ApiRestGenerator(resources, config);

//start server
server.listen(port, () => {
        
        //black magic implementation
        server.use(
            apigen.config.basePath,
            apigen.router()
        );
        console.log(`Server is running at http://localhost:${port}`);
    })


```

Now, go to http://localhost:3000/api/users ;)

## GENERATED METHODS

- __index__: List your records.
- __show__: For find by primaryKey.
- __create__: Insert new record.
- __update__: Update your record by primaryKey.
- __destroy__: Detroy your record by primaryKey.

## ENDPOINTS

- GET ``` /${basePath}/${recordPath} ``` #list 
- GET ``` /${basePath}/${recordPath}/:pk ``` #show
- POST ``` /${basePath}/${recordPath} ``` #create
- PUT ``` /${basePath}/${recordPath}/:pk ``` #update
- DELETE ``` /${basePath}/${recordPath}/:pk ``` #destroy

## CONFIGURE YOUR RESOURCES

``` javascript

[
    {
        model: ModelName,
        path: 'model-name',

        withPagination: true,

        indexConfig: (req) => {} || {},
        /*
            Example for filters:

            indexConfig: (req) => {
                const {status} = req.query;

                if(status) => {
                    return {
                        where: { status }
                    }
                }
            }

        */
        showConfig: (req) => {} || {},

        beforeCreate: (model) => model || null,
        beforeUpdate: (model) => model || null,
        beforeDestroy: (model) => model || null,

        afterCreate: (model) => model || null,
        afterUpdate: (model) => model || null,
        afterDestroy: (model) => model || null,

        middlewares: [],
        /*
            for example:
                middleware: [foo(), bar()]

            result:
                router.use(`${basePath}/${path}`,middleware[0]);
                router.use(`${basePath}/${path}`,middleware[1]);
        */

        // middewares array
        indexProtection: [] || "function", 
        showProtection: [] || "function",
        createProtection: [] || "function",
        updateProtection: [] || "function",
        destroyProtection: [] || "function"
        /*
            route.get('/path', methodProtection, (req,res) => ...)
        */
    }
]

```

## PAGINATION

We use the [sequelize-paginate](https://www.npmjs.com/package/sequelize-paginate) package to resolve the paginations. 
