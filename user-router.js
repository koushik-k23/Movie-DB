const Movie = require('./MovieModel');
const Person = require('./PersonModel');
const Review = require('./ReviewModel')
const User = require('./UserModel')
const pug = require("pug");
const express = require('express');
const ObjectId= require('mongoose').Types.ObjectId

let router = express.Router();
let oid;

router.post("/watchlist/:id",express.json(),addToWatchlist);

router.param("id", function(req, res, next, value){
	console.log("Finding movie by ID: " + value);
	try{
		oid = new ObjectId(value);
	}catch(err){
		console.log(err);
		res.status(404).send("That movie does not exist.");
		return;
	}
	
	Movie.findOne({_id:oid})
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

function addToWatchlist(req, res, next){

    User.findOne({username:req.session.username}).exec(function(err, result){
        if (err) {
            console.error(`Uh oh!`, err);
        }
        res.movie.watchlist.push(result._id);
        res.movie.save();
    });
    res.sendStatus(201)
}

router.get("/profile",getUserProfie);

function getUserProfie(req, res, next){

	User.findOne({username:req.session.username}).exec(function(err, result){
		result.findWatchListMovies((err, result1) => {
			if (err) {
			  console.error(`Uh oh!`, err);
			}
			result.findFollowedPeople((err, result2) => {
				if (err) {
				  console.error(`Uh oh!`, err);
				}
				result.findFollowedUsers((err, result3) => {
					if (err) {
					  console.error(`Uh oh!`, err);
					}
					//console.log(result2);
					res.send(pug.renderFile("./Pages/ownprofile.pug",{watchlistMovies:result1, followedPeople:result2, recommendedMovies: req.session.viewedMovies, userInfo: req.session.username, users: result3, sessionInfo : req.session}));
				});
			});
		  });
	});
}

router.post("/following_person/:personId",followPerson);

function followPerson(req, res, next){
	Person.findOne({_id:req.body[0]}).exec(function(err, result){
        if (err) {
            console.error(`Uh oh!`, err);
        }
		User.findOne({username:req.session.username}).exec(function(err, result1){
			if (err) {
				console.error(`Uh oh!`, err);
			}
			result.personFollowing.push(result1);
			result.save();
		});
    });
	res.sendStatus(201)
}

router.get("/remove_movie/:movieName", removeTheMovie)
router.get("/remove_movie/:movieName", displayTheNewWatchList)

function removeTheMovie(req,res,next){
	console.log("URL");
	console.log(req.url);
	let str = req.url;
	str = str.replace(/%20/g,' ');
	console.log(str);
	str = str.slice(14);
	console.log(str);

	Movie.findOne({Title:{ $regex:str, $options: 'i'}}).exec(function(err, result){
		User.findOne({username:req.session.username}).exec(function(err, result1){
			console.log("The watchlist contains :" + result.watchlist);
			let params = [];
			for (let i=0; i<result.watchlist; i++){
				if(result.watchlist[i] === result1._id){
					continue;
				}
				params.push(result.watchlist[i]);
			}
			console.log(params);

			result.watchlist = params;
			result.save();
			next()
		});
	});
}

function displayTheNewWatchList(req, res, next){
	User.findOne({username:req.session.username}).exec(function(err, result1){
		result1.findWatchListMovies((err, newWatchList) => {
			//console.log(newWatchList);
			res.status(201).send(pug.renderFile("./Partials/updatedWatchlist.pug",{watchlistMovies:newWatchList}))
		})
	});
}

router.get("/remove_person/:personName", removeThePerson);
router.get("/remove_person/:personName", displayTheNewPersonList)

function removeThePerson(req,res,next){
	let str  = req.url;
	str = str.replace(/%20/g,' ');
	str = str.slice(15);

	Person.findOne({name:{ $regex:str, $options: 'i'}}).exec(function(err, result){
		User.findOne({username:req.session.username}).exec(function(err, result1){
			console.log("The personfollowers list contains :" + result.personFollowing);
			let params = [];
			for (let i=0; i<result.personFollowing; i++){
				if(result.personFollowing[i] === result1._id){
					continue;
				}
				params.push(result.personFollowing[i]);
			}
			console.log(params);

			result.personFollowing = params;
			result.save();
			next()
		});
	});

}

function displayTheNewPersonList(req, res, next){
	User.findOne({username:req.session.username}).exec(function(err, result1){
		result1.findFollowedPeople((err, newPersonList) => {
			res.status(201).send(pug.renderFile("./Partials/updatedPersonList.pug",{followedPeople:newPersonList}))
		})
	});
}

router.post("/followUser/:userID", followUser);

function followUser(req, res, next){
	console.log("Here are the params: "+ req.params.userID);

	User.findOne({_id:req.params.userID}).exec(function(err, result){
		if (err) throw err;
		User.findOne({username:req.session.username}).exec(function(err, result1){
			result.following.push(result1._id);
			result.save();
			res.sendStatus(201)
		});
	})
}

router.get("/remove_user/:username", removeTheUser);
router.get("/remove_user/:username", displayTheNewUserList);
function removeTheUser(req,res, next){
	console.log("the Username is " + req.params.username);
	User.findOne({username:{ $regex:req.params.username, $options: 'i'}}).exec(function(err, result){
		let params = [];
		for (let i=0; i<result.following; i++){
			if(result.following[i] === req.session.userId){
				continue;
			}
			params.push(result.following[i]);
		}
		console.log(params);

		result.following = params;
		result.save();
		next()
	});
}

function displayTheNewUserList(req, res, next){
	User.findOne({username:req.session.username}).exec(function(err, result1){
		result1.findFollowedUsers((err, newUserList) => {
			//console.log(newWatchList);
			res.status(201).send(pug.renderFile("./Partials/updatedFollowerList.pug",{followedUser:newUserList}))
		})
	});
}

router.post("/person/contrib",addPerson);

function addPerson(req, res, next){
	Person.findOne({name:req.body.name}).exec(function(err, result){
		if (err) console.error(err);
		if (result===null){
			console.log("This person does not exist!");
			let p = new Person({
                name: req.body.name
            })
			p.save();
			res.redirect("/home");
			return;
		}
		console.log("This person exists");
		res.redirect("/contribute/addperson");
	})
}

router.post("/movie/contrib",addMovie);

function addMovie(req, res, next){
	Movie.findOne({Title:req.body.Title}).exec(function(err,result){
		if (err) console.error(err);
		if (result===null){
			console.log("This movie does not exist!");
			let m = new Movie({
                Title: req.body.title,
				Released: req.body.release,
				Runtime: req.body.runtime,
				Genre: req.boyd.genre
            })
			m.save();
			res.redirect("/home");
			return;
		}
		res.redirect("/contribute/addMovie");
	})
}

router.post("/switchContrib", switchingToContrib);

function switchingToContrib (req,res,next){
	User.findOne({_id:req.session.userId}).exec(function(err,result){
		console.log("hello");
		result.contribUser = true;
		result.save();
		req.session.contribUser = true;
		res.sendStatus(201);
	});
}


module.exports = router;
