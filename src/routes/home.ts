import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const homeRouter = express.Router();

const swaggerSpec = swaggerJSDoc({
    failOnErrors: true,
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Calvin the Barista App',
            version: '1.0.0',
        },
    },
    apis: ['../router*.ts'], // files containing annotations as above
});
console.log(swaggerSpec);
homeRouter.use('/api-docs', swaggerUi.serve);
homeRouter.get('/api-docs', swaggerUi.setup(swaggerSpec))

/**
 * @openapi
 * /:
 *   get:
 *     description: URL to get the melcome to calvin barista app!
 *     responses:
 *       200:
 *         message: Welcome to the API!
 */
homeRouter.get('/', function(req, res, next) {
    res.json({"message": "Welcome to the API!"});
});

export default homeRouter;
