const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Post = require("../models/Post");

// UPDATE

router.put("/:id", async  (req,res)=>{

    if(req.body.userId===req.params.id)
    {

        if(req.body.password)
        {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password,salt);            
        }

        try {

            const updatedUser = await User.findByIdAndUpdate(req.params.id,{
                $set: req.body,
            },{new: true});
            
            res.status(200).json(updatedUser);

            
        } catch (error) {
            res.status(500).json(error);
        }
    }
    else
    {
        res.status(401).json("Permission Denied");
    }
    
})

// DELETE

router.delete("/:id", async  (req,res)=>{

    if(req.body.userId===req.params.id)
    {     
        try {
            
            const user = await User.findById(req.params.id);

            try {

                await Post.deleteMany({username: user.username});
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json("User Deleted");

                
            } catch (error) {
                
                res.status(500).json(error);
            }

            
        } catch (error) {
            res.status(500).json(error);
        }
    }
    else
    {
        res.status(401).json("Permission Denied");
    }
    
})

// GET USER DETAILS

router.get("/:id", async (req,res)=>{
    try {
        
        const user = await User.findById(req.params.id);
        if(!user)
        {
            return res.status(400).json("User donot exists");
        }
        const {password, ...others} = user._doc;
        res.status(200).json(others);

    } catch (error) {
        res.status(500).json("Error occured");
    }
})




module.exports = router;