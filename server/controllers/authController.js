const router = require('express').Router();
const User = require('./../models/user');
const bcrypt = require('bcryptjs');

router.post('/signup', async (req,res) => {
    try {
        //1. If the user already exists
        const user = await User.findOne({ email: req.body.email});

        //2. If user exists, send an error response
        if(user){
            return res.send({
                message: "User Already exists!",
                success: false
            });
        }

        //3. encrypt the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        //4. Create new user, save in db
        const newUser = new User(req.body);
        await newUser.save();

        res.send({
            message: "User Created Successfully!",
            success: true
        });
        
    } catch (error) {
        res.send({
            message: error.message,
            success: false
        });
    }
})

module.exports = router;