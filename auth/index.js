const express = require('express');
const {login, getProfile, logout, loadProjects, loadDocumentation, updateDocumentation, refresh, getTasksList, addTask, getTaskDetails, getResponsible, updateTaskDetails} = require('../controller/controller')
const {
    verifyAuthorizationMiddleware,
    verifyRefreshTokenMiddleware,
} = require("./utils");

const authRouter = express.Router();

authRouter.post('/login', login);

authRouter.get('/profile', verifyAuthorizationMiddleware, getProfile);

authRouter.post('/updateDocumentation', updateDocumentation);

authRouter.get('/logout', logout);

authRouter.get('/projects', loadProjects);

authRouter.get('/documentation', loadDocumentation);

authRouter.get("/refresh", verifyRefreshTokenMiddleware, refresh);

authRouter.get('/tasks', getTasksList);

authRouter.post('/add_task', addTask);

authRouter.post('/taskDetails', getTaskDetails)

authRouter.get('/getResponsible', getResponsible)

authRouter.post('/taskDetailsUpdate', updateTaskDetails)

module.exports = authRouter;
