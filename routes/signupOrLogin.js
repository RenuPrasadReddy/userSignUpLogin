const router = require('express').Router();
const shortid = require('shortid');

const { User } = require('../models/model')
const {sendEmailForVerification} = require('./email1');
const isAuthenticated = require('../authentication/authenticate');


router.route('/').post((req, res) => {
    res.send('home page')
})

//route for signup
router.route('/signup').post(async (req, res) => {
    console.log("inside signup", req.body);
    // isAuthenticated();
    let currentDateAndTime = new Date(), timeLimit= new Date();
    // timeLimit = timeLimit.setMinutes(timeLimit.getMinutes() + 10);

    let newUser = {
        first_name: req.body.first_name.trim(),
        last_name: req.body.last_name.trim(),
        email: req.body.email.trim(),
        mobile_number: req.body.mobile_number.trim(),
        password: req.body.password.trim(),

        userSignedUpTime: currentDateAndTime,
        emailVerficationTimeLimit: new Date(timeLimit.setMinutes(timeLimit.getMinutes()+10)),
        emailVerified: false,
        uniqueCode: shortid.generate()
    }
    console.log({newUser});
    console.log("diff in mins=",  newUser.emailVerficationTimeLimit.getMinutes() - newUser.userSignedUpTime.getMinutes() );

    let userExistOrNot, signedUpUser;
    try{
        userExistOrNot = await User.findOne({email: req.body.email.trim()});
        if(userExistOrNot){
            console.log("user already exist");
            res.status(200).send("user already exist");
            return;
        }else{
            signedUpUser = await User.findOneAndUpdate({email: newUser.email}, newUser, {upsert: true, new: true});
            console.log("please verify your email to complete signup process");
            await sendEmailForVerification(signedUpUser);
            res.status(200).send("please verify your email to complete signup process");
            return;
        }
    }
    catch(e){
        console.log("something went wrong while adding user to db");
        res.status(500).send("try after some time");
    }
    
    res.status(200).json({newUser});
    return;
})


//route for login
router.route('/login', isAuthenticated).post(async (req, res) => {
    console.log("inside login",req.body);
    // isAuthenticated(req, res);
    let data = req.body;
    let user = await User.findOne({email: data.email.trim(), password: data.password.trim()});
    if(user){
        console.log("user exists...");
        if(user.emailVerified)
            res.status(200).send("welcome to Marmeto");
        else{
            res.status(200).send("please verify your email");
        }
    }else{
        console.log("user not exists or creds may be wrong");
        res.status(200).send("user not exists or creds may be wrong");
    }
    
})

router.route('/emailVerification/:uniqueCode').get(async (req, res) => {
    console.log("inside emailVerification", req.params.uniqueCode);
    let user = await User.findOne({uniqueCode: req.params.uniqueCode});
    let diff = user.emailVerficationTimeLimit.getMinutes() - new Date().getMinutes();
    console.log("diff in mins for email verification=", diff);
    
    if(diff<=10){
        user = await User.findOneAndUpdate({uniqueCode: req.params.uniqueCode},{emailVerified: true},{upsert: false, new: true});
        if(user.emailVerified){
            console.log("email verified, uniqCode matched");
            let loginUrl = "http://localhost:3000/user/login"
            res.send("<a href="+loginUrl+">Please Click here to login</a>");
            // res.redirect("/user/login");
            // res.sendFile('C:/Users/Prasad/Desktop/marmeto assesment/backend/Html/login.html');

        }else{
            res.json("something went wrong");
        }
    }else{
        res.json("link time expired");

    }
    
})





module.exports= router;
