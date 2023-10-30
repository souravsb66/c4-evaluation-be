const express = require("express");
const { connection } = require("./db");
const { userRouter } = require("./routes/user.route");
const { postRouter } = require("./routes/post.route");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use("/users", userRouter);
app.use("/posts", postRouter);

app.get("/", (req,res) => {
    res.send({"message": "This is the home page"});
})

app.listen(process.env.PORT, async () => {
    try {
        await connection;
        console.log("Connected to DB");
        console.log(`Listening to PORT ${process.env.PORT}`);
    }
    catch(err) {

    }
})