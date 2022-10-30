const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const { 
    MONGO_USER, 
    MONGO_PASSWORD, 
    MONGO_IP, 
    MONGO_PORT, 
    REDIS_URL,
    SESSION_SECRET,
    REDIS_PORT
} = require('./config/config');

const session = require("express-session")
let RedisStore = require("connect-redis")(session)

// redis@v4
const { createClient } = require("redis")
let redisClient = createClient({     
    url: `redis://${REDIS_URL}:${REDIS_PORT}`,
    legacyMode: true 
})
redisClient.connect().catch(console.error)

const postRouter = require('./routes/post.routes')
const userRouter = require('./routes/user.routes')

const app = express()

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
    mongoose
    .connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("successfully connected to DB"))
    .catch((e) => {
        console.log(e)
        setTimeout(connectWithRetry, 5000)
    });
}

connectWithRetry();

app.use(express.json());

app.enable("trust proxy");
app.use(cors({
    
}))
app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: SESSION_SECRET,
        cookie: {
            secure: false,
            resave: false,
            saveUninitialized: false,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24, 
        },
    })
)


app.get("/api/v1", (req, res) => {
    try {
        res.send("<h2>Hi Tahiri!!</h2>");
        console.log("yeah it ran")
    } catch (error) {
        console.log(error);
    }
})

//localhost:3000/api/v1/posts
app.use("/api/v1/posts", postRouter);
//localhost:3000/api/v1/users
app.use("/api/v1/users", userRouter);


const port = process.env.PORT || 4000 

app.listen(port, () => console.log(`Listening on port ${port}`))
