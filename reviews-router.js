const Movie = require('./MovieModel');
const Person = require('./PersonModel');
const Review = require('./ReviewModel')
const User = require('./UserModel')
const pug = require("pug");
const express = require('express');
const ObjectId= require('mongoose').Types.ObjectId
let router = express.Router();
let oid;
router.post("/:id",express.json(), saveReview);
router.get("/:id",loadReviews);

router.param("id", function(req, res, next, value){
	// let oid;
	console.log("Finding review by ID: " + value);
	try{
		oid = new ObjectId(value);
	}catch(err){
		console.log(err);
		res.status(404).send("That review does not exist.");
		return;
	}
	
	Movie.find({_id:oid})
	.exec(function(err, result){
		console.log("searching");
		if(err){
			console.log(err);
			res.status(500).send("Error reading review data.");
			return;
		}
		console.log("Result:");
		console.log(result);
		res.movie = result;
		next();
	});
});

function saveReview(req, res, next){
	console.log("THIS IS THE REQ BODY");
	console.log(req.body);
	console.log("THE USER: "+req.session.username);
	let arr  = req.body;
	console.log(res.movie[0].Title);
	
	User.findOne({username:req.session.username}).exec(function(err, result){
		let r = new Review({
			Title:res.movie[0].Title,
			movieID:res.movie[0]._id,
			UserID: result._id,
			Username: req.session.username,
			Rating:arr[0],
			Summary:arr[1],
			Review:arr[2]
			  })
		
			r.save();
		
			res.sendStatus(201); 
	})
}
function loadReviews (req, res, next){
	Review.find({movieID:oid})
	.exec(function(err, result){
		console.log("searching");
		if(err){
			console.log(err);
			res.status(500).send("Error reading review data.");
			return;
		}
		console.log(result);
		if(result.length===0){
			// res.status(404).send("That review does not exist.");
			Movie.findOne({_id:oid}).exec(function(err, result){
				if (err) {
				  console.error(`Uh oh!`, err);
				}
				result.findSimilarMovies((err, genreResult) => {
				  if (err) {
					console.error(`Uh oh!`, err);
				  }
				  res.send(pug.renderFile("./Pages/noReviewsFound.pug",{movie:genreResult,movieName:result}));
				});
			  });
			return;
		}
		console.log("Result:");
		console.log(result);
		res.status = 200;
		Movie.findOne({_id:result[0].movieID})
		.exec(function(err, result1){
			//console.log("searching");
			if(err){
				console.log(err);
				res.status(500).send("Error reading review data.");
				return;
			}
			let counter = result.length;
			let value = 0;
			for (let i=0;i<result.length; i++){
				value += parseInt(result[i].Rating);
			}
			value = value/ counter
			value = value.toFixed(1)
			res.send(pug.renderFile("./Pages/reviewPage.pug",{reviews:result,moviePoster:result1,ratingAvg: value}));
		});
		
	});
}
module.exports = router;