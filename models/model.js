const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name:String ,
    last_name:String ,
    email: String,
    mobile_number: String,
    password: String,
    userSignedUpTime: Date,
    emailVerficationTimeLimit: Date,
    emailVerified: Boolean,
    uniqueCode: String
});
const User = mongoose.model("User", userSchema);

module.exports = {User};