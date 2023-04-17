const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const UserSchema = new Schema(
    {
        username : {type: String, required: true, min: 4, unique: true},
        password : {type: String, required: true}
    }
);

UserSchema.statics.isThisUsernameInUse = function(username) {
    if(!username) throw new Error('Invalid email address')

    try{
        this.findOne({username})
        if(user) return false
        return true
    }catch(error){
        console.log('Error isThisUsernameInUse', error.message)
    }
}

const UserModel = model('User', UserSchema);
module.exports = UserModel;