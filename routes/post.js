const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  imagetext: { type: String, required: true },
  user : { type : mongoose.Schema.Types.ObjectId , ref : 'User'},
  image : { type : String , required : true},
  date: { type: Date, default: Date.now },
  likes: { type : Array, default : []}
});

module.exports = mongoose.model('Post', postSchema);
