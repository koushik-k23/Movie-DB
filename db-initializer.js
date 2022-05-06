const fileName = "./movie-data-2500.json";

const mongoose = require("mongoose");

const Movie = require('./MovieModel');
const Person = require('./PersonModel');
const Review = require('./ReviewModel')
const User = require('./UserModel')
let allMovies = []; 

let people = {};

let allPeople = [];

var users = [
  {username:"koushik" , password : "123", contribUser : true},
  {username:"manal" , password : "321", contribUser : true},
  {username:"dave" , password : "rocks", contribUser : false},
  {username:"ironman" , password : "bestsuperhero", contribUser : false},
]

function addPersonToMovie(personName, movie, position){
  
  if(!people.hasOwnProperty(personName)){
    
    let newPerson = new Person();
    
    
    newPerson._id = mongoose.Types.ObjectId();
    
    newPerson.name = personName;
    newPerson.director = [];
    newPerson.actor = [];
    newPerson.writer = [];
    
    allPeople.push(newPerson);
    
    people[newPerson.name] = newPerson;
  }
  
  
  let curPerson = people[personName];
  curPerson[position].push(movie._id);
  movie[position].push(curPerson._id);
}

let data = require(fileName);
data.forEach(movie=>{
  
  let newMovie = new Movie();
  newMovie._id = mongoose.Types.ObjectId();
  newMovie.Title = movie.Title;
  newMovie.Year = movie.Year;
  newMovie.Rated = movie.Rated;
  newMovie.Released = movie.Released;
  newMovie.Runtime = movie.Runtime;
  newMovie.Genre = movie.Genre;
  newMovie.Plot = movie.Plot;
  newMovie.Awards = movie.Awards;
  newMovie.Poster = movie.Poster;
  
  // let r = new Review({
  //   Title:movie.Title,
  //   movieID:newMovie._id,
  //   // Rating:"",
  //   // Summary:"",
  //   // Review:""
  // })

  //r.save()

  movie.Actors.forEach(actorName => {
    addPersonToMovie(actorName, newMovie, "Actors");
  })
  
  
  movie.Director.forEach(directorName => {
    addPersonToMovie(directorName, newMovie, "Director");
  })
  
  
  movie.Writer.forEach(directorName => {
    addPersonToMovie(directorName, newMovie, "Writer");
  })
  
  allMovies.push(newMovie)
})

mongoose.connect('mongodb://localhost/Db', {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  
  mongoose.connection.db.dropDatabase(function(err, result){

    Movie.insertMany(allMovies, function(err, result){
  	  if(err){
  		  console.log(err);
  		  return;
  	  }
      Person.insertMany(allPeople, function(err, result){
    	  if(err){
    		  console.log(err);
    		  return;
        }
        User.insertMany(users, function(err, result){
          if(err){
            console.log(err);
            return;
          }
          console.log("Finished :)");
          mongoose.connection.close();
        });      
      });
    });
  });
});