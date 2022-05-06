const Movie = require('./MovieModel');
const Person = require('./PersonModel');
const Review = require('./ReviewModel')
const pug = require("pug");
const express = require('express');
const ObjectId= require('mongoose').Types.ObjectId
let router = express.Router();


router.get("/", (req, res, next)=> { 
    res.status = 200;
    res.send(pug.renderFile("./Pages/searchPage.pug")) 
});
router.get("/results", queryParser);
router.get("/results", findMovies);
router.get("/results", respondMovies);

function queryParser(req,res, next){
    
    console.log(req.url);
    console.log(req.query);
    req.search = Movie.find();

    let params = [];
	for(prop in req.query){
		if(prop == "page"){
			continue;
		}
		params.push(prop + "=" + req.query[prop]);
	}
	req.qstring = params.join("&");
    console.log(req.qstring);
    try{
		req.query.page = req.query.page || 1;
		req.query.page = Number(req.query.page);
		if(req.query.page < 1){
			req.query.page = 1;
		}
	}catch{
		req.query.page = 1;
	}
    if (req.query.hasOwnProperty("Title")){
        req.search = req.search.where("Title").regex(req.query.Title);
    }
    if (req.query.hasOwnProperty("Genre")){
        req.search = req.search.where("Genre").regex(req.query.Genre)
    }
    if (req.query.hasOwnProperty("Actor")){
        //req.search = Person.where("name").regex(req.query.Actor);
        Person.findOne({name:{ $regex:req.query.Actor, $options: 'i'}}).exec(function(err, result){
            if(err) throw err;
            //console.log(result);
            req.search = req.search.where("Actors").equals(result._id);
            next();
        })
    }
    else{
        next();
    }
}

function findMovies(req,res, next){
    let startIndex = ((req.query.page-1) * 10);
	let amount = 10;

    req.search.limit(amount)
	.skip(startIndex).exec(function(err,result){
        if (err) res.status(500);
        //console.log(result);
        req.searchResults = result;
        next();
    })
}

function respondMovies (req, res, next){
    res.set("content-type","text/html");
    //console.log(req.searchResults)
    res.status(201).send(pug.renderFile("./Partials/searchResults.pug",{movieResults:req.searchResults,qstring:req.qstring,current:req.query.page}))
    
    
}

module.exports = router;