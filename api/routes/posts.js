const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Post = require("../models/Post");

// CREATE NEW POST

router.post("/newpost", async (req, res) => {

    const newPost = new Post(req.body);
    try {

        const savedPost = await newPost.save();
        res.status(200).json(savedPost);


    } catch (error) {
        res.status(500).json("Error occured");
    }
});


// UPDATE POST

router.put("/:id", async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);
        if (post.username === req.body.username) {
            try {

                const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
                    $set: req.body
                }, { new: true });

                res.status(200).json({ updatedPost });

            } catch (error) {   
                res.status(500).json("Error occured");
            }
        }
        else {
            res.status(401).json("Permission Denied");
        }


    } catch (error) {
        res.status(500).json("Error occured");
    }

});


// DELETE POST

router.delete("/:id", async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);
        if (post.username === req.body.username) {

            try {

                await post.delete();
                res.status(200).json("Post Deleted");


            } catch (error) {
                res.status(500).json("Error occured");

            }
        }
        else {
            res.status(401).json("Permission Denied");
        }

    } catch (error) {
        res.status(500).json("Error occured");
    }
});


// GET POST

router.get("/:id", async (req,res)=>{

    try {

        const post = await Post.findById(req.params.id);
        if(post)
        {
            res.status(200).json(post);
        }
        else
        {
            res.status(401).json("Post not found");
        }        
    } catch (error) {
        res.status(500).json("Error occured");
    }

})

// GETTING ALL POSTS

router.get("/", async (req,res)=>{
    const username = req.query.user;
    const catName = req.query.cat;
    try {        
        
        let posts;
        if(username)
        {
            posts = await Post.find({username});
        }
        else if(catName)
        {
            posts = await Post.find({categories: {
                $in: [catName],
            }});
        }
        else
        {
            posts = await Post.find();
        }
        res.status(200).json(posts);

    } catch (error) {
        res.status(500).json("Error occured");
    }
})



module.exports = router;