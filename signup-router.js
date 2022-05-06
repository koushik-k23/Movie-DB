const User = require('./UserModel')
const Movie = require('./MovieModel');
const Person = require('./PersonModel');
const Review = require('./ReviewModel')
const ObjectId= require('mongoose').Types.ObjectId

const pug = require("pug");
const express = require('express');
const session = require ('express-session')

let router = express.Router();
//router.use(session({ secret: 'some secret key here'}))
router.post("/", (req, res, next)=> { 
    User.find({username:{ $regex:req.body.username, $options: 'i'}}).exec(function(err, result){
        
        if (result.length===0){
            let u = new User({
                username: req.body.username,
                password : req.body.password,
                contribUser: false
            })
            req.session.loggedin = true;
            req.session.username = req.body.username;
            req.session.viewedMovies = [];
            req.session.userId = new ObjectId (result._id);
            req.session.actorVisit = [];
            req.session.contribUser = result.contribUser;
            u.save();
            res.redirect("/home");
            return
        }
        res.username = req.body.username;
        res.redirect("/signup");
    });
});

module.exports = router;