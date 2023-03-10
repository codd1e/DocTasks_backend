const express = require('express');
const {login, getProfile, logout, loadProjects, loadDocumentation, updateDocumentation, refresh} = require('../controller/controller')
const {
    verifyAuthorizationMiddleware,
    verifyRefreshTokenMiddleware,
} = require("./utils");
const cors = require('cors')
const corsOptions = {
    origin: ['https://doc-tasks-front.vercel.app', '/sign'], // домен сервиса, с которого будут приниматься запросы
    credentials: true,
    methods: ["POST", "GET", "PATCH", "DELETE"],
    // allowedHeaders: ['Access-Control-Allow-Origin', 'Content-Type', "Authorization"],
    // headers: {"Access-Control-Allow-Origin": "https://doc-tasks-front.vercel.app"}
}
const authRouter = express.Router();

authRouter.post('/login', login)

authRouter.get('/profile', verifyAuthorizationMiddleware, getProfile)

authRouter.post('/updateDocumentation', updateDocumentation)

authRouter.get('/logout', logout)

authRouter.get('/projects', loadProjects)

authRouter.get('/documentation', loadDocumentation)

authRouter.get("/refresh", verifyRefreshTokenMiddleware, refresh);

module.exports = authRouter;
