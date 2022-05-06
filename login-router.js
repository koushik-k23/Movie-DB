const Movie = require('./MovieModel');
const Person = require('./PersonModel');
const Review = require('./ReviewModel')
const User = require('./UserModel')
const pug = require("pug");
const express = require('express');
const session = require ('express-session')
const ObjectId= require('mongoose').Types.ObjectId

let router = express.Router();

router.post("/", (req, res, next)=> { 
    

    User.findOne({username:req.body.username, password:req.body.password}).exec(function(err, result){
        if (req.session.loggedin) {
            res.status(200).send("Already logged in...");
            return;
          }
        console.log(result);
        if (result===null){
             res.redirect("/");
             return;
        }
        else{
            req.session.loggedin = true;
            req.session.username = req.body.username;
            req.session.viewedMovies = [];
            req.session.userId = new ObjectId (result._id);
            req.session.actorVisit = [];
            req.session.contribUser = result.contribUser;
            res.redirect("/home")
        }
        
    });
    // let username = req.body.username;
    // let password = req.body.password;

    // console.log("Logging in with credentials:");
    // console.log("Username: " + username);
    // console.log("Password: " + password);
    
    // if (!users.hasOwnProperty(username)){
    //     // return res.status(401).send("INVALID");
    //     return res.status(401).redirect("/");
    // }

    // if (users[username].password != password){
    //     //return alert("Invalid")
    //     //return res.status(401).send("INVALID");
    //     return res.status(401).redirect("/");
    // }

    //res.redirect("/home");
});

module.exports = router;