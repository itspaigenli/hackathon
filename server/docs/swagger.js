import swaggerJSDoc from 'swagger-jsdoc'

const PORT = process.env.PORT || 3000;

const swaggerDefinition = {
    openapi: '3.2.0',
    info: {
        title:  'Zombie Survival API',
        version: '1.0.0',
        description: 'This API is for managing safehouses, servivors, and supplies'
    },
    servers: [{
        url: `http://localhost:${PORT}`,
        description: 'Development server'
    }],
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'],
};

const swaggerSpecs = swaggerJSDoc(options);

export default swaggerSpecs;