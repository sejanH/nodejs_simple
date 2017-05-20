var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
mongoose.connect('mongodb://localhost/nodeauth');
var db = mongoose.connection;

var UserSchema = mongoose.Schema({
   username:{
       type: String,
       index: true
   } ,
    pass :{
        type: String,
        required:true,
        bcrypt:true
    },
    email:{
       type: String
    },
    fullName:{
       type: String
    },
    dob:{
       type: String
    }
});

var User = module.exports = mongoose.model('User',UserSchema);

module.exports.getUserById = function (id,callback) {
    User.findById(id,callback);
}
module.exports.getUserByUsername = function (username,callback) {
    var query = {username: username};
    User.findOne(query,callback);
}


module.exports.comparePassword = function (candidatePassword,hash,callback) {
    bcrypt.compare(candidatePassword,hash,function (err,isMatch) {
        if(err) return callback(err);
        callback(null,isMatch);
    });
}


module.exports.createUser = function (newUser,callback) {
    bcrypt.hash(newUser.pass,10,function (err,hash) {
        if(err) throw err;
        //set hashed pass
        newUser.pass = hash;
        //create a new user
        newUser.save(callback);
    });
}