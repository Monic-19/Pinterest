var express = require('express');
var router = express.Router();

const mongoose = require("mongoose")
const plm = require('passport-local-mongoose')


mongoose.connect("mongodb://localhost:27017/Pinterest");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  dp: { type: String }, // Profile picture URL
  email: { type: String },
  fullname: { type: String }
});

userSchema.plugin(plm);


module.exports = mongoose.model('User', userSchema);


