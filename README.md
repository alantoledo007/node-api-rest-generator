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
    basePath = '/api';
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
        showConfig: (req) => {} || {},

        beforeCreate: (model) => model,
        beforeUpdate: (model) => model,

        afterCreate: (model) => model,
        afterUpdate: (model) => model,

        protection: (req, res, next) => next(), // for protect all methods

        indexProtection: [], // middeware array
        showProtection: [],
        createProtection: [],
        updateProtection: [],
        destroyProtection: []
    }
]

```

## PAGINATION

We use the [sequelize-paginate](https://www.npmjs.com/package/sequelize-paginate) package to resolve the paginations. 
