const crypto = require('crypto')
const {passwordSecret} = require("../auth/data");
const {getTokens, refreshTokenAge} = require("../auth/utils");
const cookie = require("cookie");
const MongoClient = require("mongodb").MongoClient;
const url = process.env.MONGO_URL
const mongoClient = new MongoClient(url);

let user = {}
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
                httpOnly: true,
                maxAge: refreshTokenAge,
                domain: 'doc-tasks-front.vercel.app',
                sameSite: 'None',
                secure: true
            })
        )
        res.cookie('refreshToken', refreshToken, {
            maxAge:60 * 60 * 24,
            httpOnly: true,
        })
        res.send({accessToken})
        user = {...currUser};
    }catch(err) {
        console.log(err);
    }
}

const getProfile = async (req, res) => {
    const login = user.login;
    const role = user.role;
    res.send({login, role});
}

const refresh = async (req, res) => {
    const { accessToken } = getTokens(req.user.login);

    res.send({ accessToken });
}

const logout = async (req, res) => {
    res.setHeader(
        "Set-Cookie",
        cookie.serialize("refreshToken", "", {
            httpOnly: true,
            maxAge: 0,
            domain: 'doc-tasks-front.vercel.app',
            sameSite: 'None',
            secure: true
        })
    )
    res.cookie('refreshToken', "", {
        maxAge: 0,
        httpOnly: true,
    })
    res.sendStatus(200);
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

module.exports = {login, getProfile, logout, loadProjects, loadDocumentation, updateDocumentation, refresh};
