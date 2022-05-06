const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let personSchema = Schema({
    name: String,
    Director: [{type:Schema.Types.ObjectId, ref: 'Movie'}],
    Actors: [{type:Schema.Types.ObjectId, ref: 'Movie'}],
    Writer: [{type:Schema.Types.ObjectId, ref: 'Movie'}],
    personFollowing: [{type: Schema.Types.ObjectId, ref: 'User'}]
  });

let Person = mongoose.model("Person",personSchema)
module.exports = Person;