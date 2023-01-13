const { default: mongoose } = require('mongoose');

const profileSchema =  mongoose.Schema({
    firstname : {
    type:String,
    required : [true,'First name is required']
    },
    lastname : {
        type:String,
        required : [true,'Last name is required']
    },
    image : {
        type:String,
        required : [true,'Image is required']
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }

},{timestamps : true})

module.exports = mongoose.model('Profile',profileSchema)