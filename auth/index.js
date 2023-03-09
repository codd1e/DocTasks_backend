const express = require('express');
const {login, getProfile, logout, loadProjects, loadDocumentation, updateDocumentation, refresh} = require('../controller/controller')
const {
    verifyAuthorizationMiddleware,
    verifyRefreshTokenMiddleware,
} = require("./utils");
const cors = require('cors')
const corsOptions = {
    origin: ['http://localhost:3000', 'https://doc-tasks-front.vercel.app/'], // домен сервиса, с которого будут приниматься запросы
    credentials: true,
    methods: ["POST", "GET", "PATCH", "DELETE"],
    allowedHeaders: ['Content-Type','Authorization', 'contenttype'],
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
