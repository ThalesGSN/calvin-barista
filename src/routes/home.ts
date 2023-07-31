import express from "express";

const homeRouter = express.Router();
homeRouter.get('/', function(req, res, next) {
    res.redirect('/api-docs');
});

export default homeRouter;
