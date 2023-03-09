const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./auth/index");
const cors = require("cors")
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: '*',
    credentials: true
}))
app.use(authRouter)

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        app.listen(5000, () => {
            console.log(`Server started on PORT = 5000`)
        })
    } catch (e) {
        console.log(e)
    }
}

start();

