const express = require('express');
const {login, getProfile, logout, loadProjects, loadDocumentation, updateDocumentation, refresh} = require('../controller/controller')
const {
    verifyAuthorizationMiddleware,
    verifyRefreshTokenMiddleware,
} = require("./utils");
const cors = require('cors')
const corsOptions = {
    origin: false, // домен сервиса, с которого будут приниматься запросы
    credentials: true,
    methods: ["POST", "GET", "PATCH", "DELETE"],
    // allowedHeaders: ['Access-Control-Allow-Origin', 'Content-Type', "Authorization"],
    // headers: {"Access-Control-Allow-Origin": "https://doc-tasks-front.vercel.app"}
}
const authRouter = express.Router();

authRouter.post('/login', cors(corsOptions), login)

authRouter.get('/profile', cors(corsOptions), verifyAuthorizationMiddleware, getProfile)

authRouter.post('/updateDocumentation', cors(corsOptions), updateDocumentation)

authRouter.get('/logout', cors(corsOptions), logout)

authRouter.get('/projects', cors(corsOptions), loadProjects)

authRouter.get('/documentation', cors(corsOptions), loadDocumentation)

authRouter.get("/refresh", cors(corsOptions), verifyRefreshTokenMiddleware, refresh);

module.exports = authRouter;
