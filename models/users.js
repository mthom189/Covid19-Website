//instance of the collection class
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: {type: String, required: [true, 'First name is required']},
    lastName: {type: String, required: [true, 'Last name is required']},
    email: {type: String, required: [true, 'Email cannot be empty'],
     unique: [true, 'This email address already belongs to a user']},
    password: {type: String, required: [true, 'Password is required']}
});

userSchema.pre('save', function(next){
    let user = this;
    if(!user.isModified('password'))
        return next();
    bcrypt.hash(user.password, 10)
    .then(hash=>{
        user.password = hash;
        next();
    })
    .catch(err=>next(err));
});

//implement method to compare login password to hash
userSchema.methods.comparePassword = function(inputPassword){
    return bcrypt.compare(inputPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);
