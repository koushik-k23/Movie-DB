const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let movieSchema = Schema({
    Title: {type: String, required: true},
    Year: {type: String},
    Rated: { type: String, required: true },
    Released: { type: String, required: true },
    Runtime: {type: String},
    Genre: [String],
    Director: [{type: Schema.Types.ObjectId, ref: 'Person'}],
    Actors: [{type: Schema.Types.ObjectId, ref: 'Person'}],
    Writer: [{type: Schema.Types.ObjectId, ref: 'Person'}],
    Plot: [String],
    Awards: { type: String, required: true },
    Poster: { type: String, required: true },
    watchlist: [{type: Schema.Types.ObjectId, ref: 'User'}],
  });

movieSchema.methods.findActor = function(callback){
  this.model("Person").find()
  .where("Actors").equals(this._id)
  .populate("Director Actors Writer")
  .exec(callback);
};
movieSchema.methods.findDirector = function(callback){
  this.model("Person").find()
  .where("Director").equals(this._id)
  .populate("Director Actors Writer")
  .exec(callback);
};
movieSchema.methods.findWriter = function(callback){
  this.model("Person").find()
  .where("Writer").equals(this._id)
  .populate("Director Actors Writer")
  .exec(callback);
};
movieSchema.methods.findWriter = function(callback){
  this.model("Person").find()
  .where("Writer").equals(this._id)
  .populate("Director Actors Writer")
  .exec(callback);
};
movieSchema.methods.findSimilarMovies = function(callback){
  this.model("Movie").find({Title: { $ne: this.Title }})
  .where("Genre").equals(this.Genre)
  .populate("Director Actors Writer").limit(4)
  .exec(callback);
};
let Movie = mongoose.model("Movie",movieSchema)
module.exports = Movie;