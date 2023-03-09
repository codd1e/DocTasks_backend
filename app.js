const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./auth/index");
const cors = require("cors")
const mongoose = require("mongoose");

const app = express();
const corsOptions = {
    origin: ['http://localhost:3000'], // домен сервиса, с которого будут приниматься запросы
    credentials: true,
    methods: ["POST", "GET", "PATCH", "DELETE"],
}
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions))
app.use(authRouter)


const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        app.listen(process.env.PORT | '5000', () => {
            console.log(`Server started`)
        })
    } catch (e) {
        console.log(e)
    }
}

start();

