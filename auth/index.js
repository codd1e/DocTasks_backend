const express = require('express');
const {login, getProfile, logout, loadProjects, loadDocumentation, updateDocumentation, refresh, getTasksList, addTask, getTaskDetails, getResponsible, updateTaskDetails, register, deleteUser, deleteTask, addProject, deleteProject} = require('../controller/controller')
const {
    verifyAuthorizationMiddleware,
    verifyRefreshTokenMiddleware,
} = require("./utils");

const authRouter = express.Router();

authRouter.post('/login', login);

authRouter.post('/createUser', register);

authRouter.delete('/user', deleteUser);

authRouter.get('/profile', verifyAuthorizationMiddleware, getProfile);

authRouter.put('/updateDocumentation', updateDocumentation);

authRouter.get('/logout', logout);

authRouter.post('/projects', addProject);

authRouter.get('/projects', loadProjects);

authRouter.delete('/deleteProject', deleteProject);

authRouter.get('/documentation', loadDocumentation);

authRouter.get("/refresh", verifyRefreshTokenMiddleware, refresh);

authRouter.get('/tasks', getTasksList);

authRouter.post('/add_task', addTask);

authRouter.post('/taskDetails', getTaskDetails)

authRouter.get('/getResponsible', getResponsible)

authRouter.put('/taskDetailsUpdate', updateTaskDetails)

authRouter.delete('/task', deleteTask)

module.exports = authRouter;
