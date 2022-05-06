const express = require('express');
const session = require ('express-session');
const pug = require("pug");
const app = express();
const mongoose = require("mongoose");

const Movie = require('./MovieModel');
const Person = require('./PersonModel');
const Review = require('./ReviewModel')
const User = require('./UserModel')

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

let movieCollection =[] ;
app.use(
  session({
    secret: "blah",
    resave: true, // saves session after every request
    saveUninitialized: false, // stores the session if it hasn't been stored
    cookie: {
      maxAge: 3600000
    }
  })
);

function auth(req, res, next) {
	if(!req.session.loggedin){
		res.status(401);
    res.redirect("/");
		return;
	}

	next();
};
app.get("/", (req, res, next)=> { 
    res.status = 200;
    res.send(pug.renderFile("./public/signin.pug")) 
});

let loginRouter = require('./login-router');
app.use("/login",loginRouter);

app.get("/signup", (req, res, next)=> { 
    res.status = 200;
    res.send(pug.renderFile("./Pages/signup.pug")) 
});

let createUser = require('./signup-router');
app.use("/createUser",createUser);

app.use(auth);

app.get("/home", (req, res, next)=> { 
    res.status = 200;
    console.log(req.session.username);
    console.log(req.session);
    res.send(pug.renderFile("./Pages/homepage.pug",{userInfo:req.session})) 
});

app.get("/movielist", (req, res, next)=> { 
  res.status = 200;
  res.send(pug.renderFile("./Pages/movieList.pug",{movies:movieCollection})) 
});

app.get("/movielist/:id",sendID);

function sendID(req, res, next){
	let oid;
	try{
		oid = req.params.id;
    //console.log(oid);
	}catch{
		res.status(404).send("Unknown ID");
		return;
	}

  Movie.findOne({_id:oid}).exec(function(err, result){
    result.findActor((err, result1) => {
      if (err) {
        console.error(`Uh oh!`, err);
      }
      result.findDirector((err, result2) => {
          if (err) {
            console.error(`Uh oh!`, err);
          }
          result.findWriter((err, result3) => {
              if (err) {
                console.error(`Uh oh!`, err);
              }
              result.findSimilarMovies((err, genreResult) => {
                if (err) {
                  console.error(`Uh oh!`, err);
                }
                req.session.viewedMovies.push(result);
                if (req.session.viewedMovies.length===5){
                  req.session.viewedMovies.shift();
                }
                console.log(result);
                res.send(pug.renderFile("./Pages/moviePage.pug",{movie:result,actors:result1,director:result2,writer:result3,similarMovies:genreResult}));
              });
            });
        });
    });
  })
}

app.get("/movielist/person/:personName",sendActor);

function sendActor(req, res, next){
  res.status(200)
	console.log(req.params.personName);
	Movie.find({Actors:req.params.personName}).exec(function(err, result){
    Person.findOne({_id:req.params.personName}).exec(function(err, result1){
      Movie.find({Director:req.params.personName}).exec(function(err, result2){
        Movie.find({Writer:req.params.personName}).exec(function(err, result3){
          req.session.actorVisit.push({id : result1._id, name:result1.name});
          if (req.session.actorVisit.length===5){
            req.session.actorVisit.shift();
          }
          res.send(pug.renderFile("./Pages/personPage.pug",{person: result1, titles: result, director:result2, writer: result3}));
        });
      });
    });
  });
}

app.get("/movielist/genre/:genre", (req, res, next)=> { 
  res.status = 200;
  Movie.find({Genre:req.params.genre}).exec(function(err, result){
    res.send(pug.renderFile("./Pages/movieList.pug",{movies:result})) 
  });
});

let reviewRouter = require('./reviews-router');
app.use("/review",reviewRouter);

let searchRouter = require('./search-router');
app.use("/search",searchRouter);

let userRouter = require('./user-router');
app.use("/user",userRouter);

app.get("/logout", logout);

app.get("/allUsers", renderAllUsers);

function renderAllUsers(req, res, next){
  User.find().exec(function(err, result){
    if (err) throw err;
    res.send(pug.renderFile("./Pages/allUsers.pug",{users:result}));
  })
}

app.get("/allUsers/:id", renderUserPage);

function renderUserPage (req, res, next){
  console.log("The Params is " + req.params.id);
  if(req.params.id === req.session.userId){
    res.redirect("/user/profile")
    res.status(200)
    return;
  }
  else{
  User.findOne({_id:req.params.id}).exec(function(err, result){
    result.findWatchListMovies((err, result1) => {
      result.findFollowedPeople((err, result2) => {
        result.findFollowedUsers((err, result3) => {
          //res.send(pug.renderFile("./Pages/profile.pug", {user: result,watchlist:result1,followedPeople:result2, followedUser:result3}));
          result.findUserReviews((err, result4) => {
            res.send(pug.renderFile("./Pages/profile.pug", {user: result,watchlist:result1,followedPeople:result2, followedUser:result3, userReview: result4}));
          });
        });
      });
    });
    
  });
}
}
function logout(req, res, next){
	if(req.session.loggedin){
		req.session.loggedin = false;
    req.session.username = undefined;
		res.status(200);
    res.redirect("/");
	}else{
		res.status(200);
    res.redirect("/");
	}
}

app.get("/contribute",nextLevelAuth,contribRender);

function nextLevelAuth (req,res,next){
  if (!req.session.loggedin || !req.session.contribUser){
    res.status(401);
    res.redirect('/home');
    return
  }
  next()
}

function contribRender (req,res, next){
  res.status = 200;
  res.send(pug.renderFile("./Pages/contribCreatPage.pug"));
}

app.get("/contribute/addperson",nextLevelAuth,personContribRender);

function personContribRender(req,res,next){
  res.send(pug.renderFile("./Pages/contribPerson.pug"));
}
app.get("/contribute/addMovie",nextLevelAuth,movieContribRender);

function movieContribRender(req,res,next){
  res.status(200);
  Person.find().sort({ name: 1 }).select("name").exec(function(err,result){
    res.send(pug.renderFile("./Pages/contribMoviePage.pug",{results:result}))
  });
}


mongoose.connect('mongodb://localhost/Db', {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  Movie.find().exec(function(err, result){
    if(err)throw err;
    movieCollection = result;
    //console.log(result);
  });

  app.listen(3000);
  console.log("Server listening on port 3000");
});