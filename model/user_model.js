const mongoose=require('mongoose')
const crypto=require('crypto')
const storySchema=mongoose.Schema({
    imageId:{
        type:String,
        required:true,
        default:''
    },
    tag:{
        type:String,
        required:true,
        default:''
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:86400
    }
})
const User=mongoose.Schema({
    userId:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    name:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    dob:{
        type:String,
        required:true,
    },
    follower:{
        type:Number,
        default:0
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    aadhar:{
        type:String,
        default:''
    },
    follows:{
        type:Number,
        default:0
    },
    followerlist:{
        type:Array,
        default:[]
    },
    followslist:{
        type:Array,
        default:[]
    },
    profileId:{
        type:String,
    },
    bio:{
        type:String,
        default:''
    },
    status:{
        type:[storySchema],
        default:[]
    },

},{timestamps:true});

User.methods.setPassword = function(password) {
    return crypto.pbkdf2Sync(password, 'insta_clone_server_rounds_10',  1000, 64, `sha512`).toString(`hex`); 
}; 
User.methods.checkValidpassword = function(password,hashedpassword) { 
    return hashedpassword == crypto.pbkdf2Sync(password, 'insta_clone_server_rounds_10', 1000, 64, `sha512`).toString(`hex`)
}; 
module.exports=mongoose.model('User',User);