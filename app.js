const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./auth/index");
const cors = require("cors")
const mongoose = require("mongoose");

const app = express();
const corsOptions = {
    origin: false, // домен сервиса, с которого будут приниматься запросы
    credentials: true,
}
app.options('*', cors(corsOptions))
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions))
app.use(authRouter)


const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        app.listen( 5000, () => {
            console.log(`Server started`)
        })
    } catch (e) {
        console.log(e)
    }
}

start();

