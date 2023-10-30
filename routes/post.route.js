const express = require("express");
const { auth } = require("../middlewares/auth.middleware");
const { PostModel } = require("../models/post.model");

const postRouter = express.Router();
postRouter.use(auth);


//Add Posts 
postRouter.post("/add", async (req,res) => {
    try {

        // console.log(req.body);

        const newPost = new PostModel(req.body);
        await newPost.save();

        res.status(200).send({"message":"New Post Created", "newPost": newPost});
    }
    catch(err) {
        console.log(err);
        res.status(400).send({"error": err.message});
    }
})

//Get Posts
postRouter.get("/", async (req,res) => {

    const { name, userID } = req.body;
    try {
        const posts = await PostModel.find({userID});
        res.status(200).send(posts);
    }
    catch(err) {
        console.log(err);
        res.status(400).send({"error": err.message});
    }
})

//Update Route
postRouter.patch("/update/:postID", async (req,res) => {
    
    const { postID } = req.params;
    const post = await PostModel.findOne({_id: postID});

    const { name, userID } = req.body;

    try {
        if(userID === post.userID) {
            await PostModel.findByIdAndUpdate({_id: postID}, req.body);
            res.status(200).send({"message": `Post with ID ${postID} has been updated.`});
        }
        else {
            res.status(200).send({"error": "You're not authorized!"})
        }
    }
    catch(err) {
        console.log(err);
        res.status(400).send({"error": err.message});
    }
})

//Delete Route
postRouter.delete("/delete/:postID", async (req,res) => {
    
    const { postID } = req.params;
    const post = await PostModel.findOne({_id: postID});

    const { name, userID } = req.body;

    try {
        if(userID === post.userID) {
            await PostModel.findByIdAndDelete({_id: postID});
            res.status(200).send({"message": `Post with ID ${postID} has been deleted.`});
        }
        else {
            res.status(200).send({"error": "You're not authorized!"})
        }
    }
    catch(err) {
        console.log(err);
        res.status(400).send({"error": err.message});
    }
})


module.exports = {
    postRouter
}