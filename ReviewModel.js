const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let reviewSchema = Schema({
    Title: {type: String},
    Rating: {type: String},
    Summary : {type: String},
    Review : {type: String},
    movieID: {type:Schema.Types.ObjectId, ref: 'Movie'},
    UserID: {type:Schema.Types.ObjectId, ref: 'User'},
    Username: {type:String}
  });
  reviewSchema.methods.findPoster = function(callback){
    this.model("Movie").find()
    .where("_id").equals(this._id)
    .populate("Poster")
    .exec(callback);
  };

let Review = mongoose.model("Review",reviewSchema)
module.exports = Review;