const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../models/blacklist.model");

const userRouter = express.Router();

userRouter.post("/register", async (req,res) => {
    let {name, email, gender, password, age, city, is_married} = req.body;

    const users = await UserModel.findOne({email});
    
    if(users) {
        res.status(200).send({"error": "User already redistered, please login"});
    }
    else {
        try {
            bcrypt.hash(password, 5, async(err,hash) => {
                if(err) {
                    res.status(200).send({"error": err.message});
                }
                else {
                    const user = new UserModel({
                        name,
                        email,
                        gender,
                        password: hash,
                        age,
                        city,
                        is_married
                    })
    
                    await user.save();
                    res.status(200).send({"message":"A new user has been registered", "newUser": user});
                }
            })
        }
        catch(err) {
            console.log(err);
            res.status(400).send({"error": "err.message"});
        }
    }
})

userRouter.post("/login", async (req,res) => {

    const {email, password} = req.body;

    try {
        const user = await UserModel.findOne({email});

        bcrypt.compare(password, user.password, (err,result) => {

            if(result) {
                let {name, _id} = user;
                const token = jwt.sign({name: name, userID: _id}, "avengers");
                res.status(200).send({"message":"Succesfully Logged In", "token": token});
            }
            else {
                res.status(200).send({"message": "Invalid Credentials, login again..!"});
            }
        })
    }
    catch(err) {
        console.log(err);
        res.status(400).send({"error": "err.message"});
    }
})

userRouter.get("/logout", async (req,res) => {

    const { token } = req.query;

    try {
        const blacklist = new BlacklistModel({token});

        await blacklist.save();
        res.status(200).send({"message": "Logged out succesfully!!!"});
    }
    catch(err) {
        console.log(err);
        res.status(400).send({"error": "err.message"});
    }
})

module.exports = {
    userRouter
}