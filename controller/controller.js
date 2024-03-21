const crypto = require('crypto')
const {passwordSecret} = require("../auth/data");
const {getTokens, refreshTokenAge} = require("../auth/utils");
const cookie = require("cookie");
const MongoClient = require("mongodb").MongoClient;
const url = process.env.MONGO_URL
const mongoClient = new MongoClient(url);

let user = {
    login: '',
    name: '',
    role: '',
    post: '',
    team: '',
    avatar: ''
}
const register = async (req, res) => {
    const {login, password, name, role, post, team, avatar} = req.body;
    try {
        await mongoClient.connect();
        const db = mongoClient.db("mySystem");
        const collection = db.collection("users");
        const hash = crypto
            .createHmac("sha256", passwordSecret)
            .update(password)
            .digest("hex")
        const hasUserName = await collection.findOne({login: login});
        if (hasUserName) {
            return res.status(400).json({
                message: 'Пользователь с таким логином уже есть в системе',
            });
        }
        user = {
            login: login,
            passwordHash: hash,
            name: name,
            role: role,
            post: post,
            team: team,
            avatar: avatar
        };
        await collection.insertOne(user)
        res.send({...user, password: password})
    }catch(err) {
        console.log(err);
    }
}


const login = async (req, res) => {
    const {login, password} = req.body;
    try {
        await mongoClient.connect();
        const db = mongoClient.db("mySystem");
        const collection = db.collection("users");
        const hash = crypto
            .createHmac("sha256", passwordSecret)
            .update(password)
            .digest("hex")
        const currUser = await collection.findOne({login: login});
        let isVerified = false;
        let role;
        if (!currUser) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }
        if(currUser.login === login && currUser.passwordHash === hash){
            isVerified = true;
        } else{
            return res.status(401).json({
                message: 'Не верный логин или пароль'
            })
        }
        const {accessToken, refreshToken} = getTokens(login)
        res.setHeader(
            "Set-Cookie",
            cookie.serialize("refreshToken", refreshToken, {
                maxAge: 60 * 60,
                httpOnly: true,
                sameSite: 'none',
                secure: true
            })
        );
        res.send({accessToken, refreshToken})
        user = {
            login: currUser.login,
            name: currUser.name,
            role: currUser.role,
            post: currUser.post,
            team: currUser.team,
            avatar: currUser.avatar
        };
    }catch(err) {
        console.log(err);
    }
}

const deleteUser = async (req, res) => {
    const {login} = req.body;
    try {
        await mongoClient.connect();
        const db = mongoClient.db("mySystem");
        const collection = db.collection("users");
        const hasUserName = await collection.findOne({login: login});
        if (!hasUserName) {
            return res.status(400).json({
                message: 'Пользователь не найден',
            });
        }
        await collection.deleteOne({login: login})
        return res.status(200).json({
            message: 'Пользователь успешно удален'
        })
    }catch(err) {
        console.log(err);
    }
}

const getProfile = async (req, res) => {
    const login = user.login
    const name = user.name;
    const role = user.role;
    const post = user.post;
    const team = user.team;
    const avatar = user.avatar;
    res.send({login, name, role, post, team, avatar});
}

const logout = async (req, res) => {
    res.setHeader(
        "Set-Cookie",
        cookie.serialize("refreshToken", "", {
            httpOnly: true,
            maxAge: 0,
            sameSite: 'none',
            secure: true
        })
    );
    res.sendStatus(200);
}

const refresh = async (req, res) => {
    const { accessToken, refreshToken } = getTokens(req.user.login);
    res.setHeader(
        "Set-Cookie",
        cookie.serialize("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60,
        })
    );
    res.send({ accessToken });
}

const addProject = async (req, res) => {
    try {
        const {title, sub} = req.body;
        await mongoClient.connect();
        const db = mongoClient.db("mySystem");
        const collection = db.collection("projects");
        await collection.insertOne({title: title, sub: sub})
        const results = await collection.find().toArray();
        res.send(results);
    } catch (err) {

    }
}

const loadProjects = async (req, res) => {
    try {
        await mongoClient.connect();
        const db = mongoClient.db("mySystem");
        const collection = db.collection("projects");
        const results = await collection.find().toArray();
        res.send(results);

    }catch(err) {
        console.log(err);
    }
}

const deleteProject = async (req, res) => {
    const {id} = req.body;
    try {
        await mongoClient.connect();
        const db = mongoClient.db("mySystem");
        const collection = db.collection("projects");
        const hasProject = await collection.findOne({id: id});
        if (!hasProject) {
            return res.status(400).json({
                message: 'Проект не найден',
            });
        }
        await collection.deleteOne({id: id})
        return res.status(200).json({
            message: 'Проект успешно удален'
        })
    }catch(err) {
        console.log(err);
    }
}

const loadDocumentation = async (req, res) => {
    try {
        await mongoClient.connect();
        const db = mongoClient.db("mySystem");
        const collection = db.collection("documentation");
        const results = await collection.find().toArray();
        res.send(results);

    }catch(err) {
        console.log(err);
    }
}

const updateDocumentation = async (req, res) => {
    const {id, text} = req.body;
    try {
        await mongoClient.connect();
        const db = mongoClient.db("mySystem");
        const collection = db.collection("documentation");
        await collection.updateOne({projectId: id}, {$set: {text: text}});
        res.sendStatus(200);

    }catch(err) {
        console.log(err);
    }
}

const getTasksList = async (req, res) => {
    try {
        await mongoClient.connect();
        const db = mongoClient.db("mySystem");
        const collection = db.collection("tasks");
        const results = await collection.find().toArray();
        res.send(results);

    }catch(err) {
        console.log(err);
    }
}

const addTask = async (req, res) => {
    try {
        const {id, previewName, description, responsible, status} = req.body;
        await mongoClient.connect();
        const db = mongoClient.db("mySystem");
        const taskListCollection = db.collection("tasks");
        const taskDetailsCollection = db.collection('tasksDetails');
        await taskListCollection.insertOne({id: id, previewName: previewName, responsible: responsible, status: status})
        await taskDetailsCollection.insertOne({id: id, previewName: previewName, description: description, timeSpent: '', jobDescription: '',  status: status, responsible: responsible,})
        const results = await taskListCollection.find().toArray();
        res.send(results);
    } catch (err) {

    }
}

async function getTaskDetails (req, res) {

    try {
        await mongoClient.connect();
        const db = mongoClient.db("mySystem");
        const collection = db.collection("tasksDetails");
        const results = await collection.findOne({id: req.body.id});
        res.send(results);

    }catch(err) {
        console.log(err);
    }
}

const getResponsible = async (req, res) => {
    try {
        await mongoClient.connect();
        const db = mongoClient.db("mySystem");
        const collection = db.collection("users");
        const results = await collection.find().toArray();
        const usersNames = results.map((user) => {
            return {name: user['name']}
        })
        res.send(usersNames);

    }catch(err) {
        console.log(err);
    }
}

const updateTaskDetails = async (req, res) => {
    const {id, previewName, description, timeSpent, jobDescription, status} = req.body;
    try {
        await mongoClient.connect();
        const db = mongoClient.db("mySystem");
        const collection = db.collection("tasks");
        await collection.findOneAndUpdate({id: id}, {$set: {previewName: previewName, status: status}});
        const listCollection = db.collection('tasksDetails')
        await listCollection.findOneAndUpdate({id: id}, {$set: req.body})
        return res.send(req.body)

    }catch(err) {
        console.log(err);
    }
}

const deleteTask = async (req, res) => {
    const {id, previewName, description, timeSpent, jobDescription, status} = req.body;
    try {
        await mongoClient.connect();
        const db = mongoClient.db("mySystem");
        const collection = db.collection("tasks");
        const task = await collection.findOne({id: id})
        if (!task) {
            return res.status(400).json({
                message: 'Задача не найдена',
            });
        }
        await collection.deleteOne({id: id});
        const listCollection = db.collection('tasksDetails')
        await listCollection.deleteOne({id: id})
        return res.sendStatus(200)

    }catch(err) {
        console.log(err);
    }
}

module.exports = {register, login, getProfile, logout, loadProjects, loadDocumentation, updateDocumentation, refresh, getTasksList, addTask, getTaskDetails, getResponsible, updateTaskDetails, deleteUser, deleteTask, addProject, deleteProject};
