const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const UserShema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
})

UserShema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',UserShema);