const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    following: [{type: Schema.Types.ObjectId, ref: 'User'}],
    // personFollowing: [{type: Schema.Types.ObjectId, ref: 'Person'}],
    contribUser : {type: Boolean, required: true}
  });

userSchema.methods.findWatchListMovies = function(callback){
  this.model("Movie").find()
  .where("watchlist").equals(this._id).populate()
  .exec(callback);
}

userSchema.methods.findFollowedPeople = function(callback){
  this.model("Person").find()
  .where("personFollowing").equals(this._id).populate()
  .exec(callback);
}

userSchema.methods.findFollowedUsers = function(callback){
  this.model("User").find()
  .where("following").equals(this._id).populate()
  .exec(callback);
}

userSchema.methods.findUserReviews = function(callback){
  this.model("Review").find()
  .where("UserID").equals(this._id).populate()
  .exec(callback);
}

let User = mongoose.model("User",userSchema)
module.exports = User;