const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// FOR NEW REGISTRATION

router.post("/register", async (req,res)=>{
    try{

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password,salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashPassword,

        })

        const user = await newUser.save();
        res.status(200).json(user);

    }   
    catch(err){
        res.status(500).json({err});

    }
})

// FOR LOGIN

router.post("/login", async (req,res)=>{

    try {
        
        const user = await User.findOne({username: req.body.username});
        if(!user)
        {
            res.status(400).json({error: "User Not Found"});
        }
        
        const validate = await bcrypt.compare(req.body.password,user.password);
        if(!validate)
        {            
            res.status(400).json({error: "User Not Found"});
        }
        
        const {password,...others} = user._doc;

        res.status(200).json({others});


    } catch (error) {
        res.status(500).json({error});
    }
    
})

module.exports = router;