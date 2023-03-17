const mongoose=require('mongoose')

const Post=mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    title:{
        type:String,
    },
    imageId:{
        type:String,
        required:true,
    },
    tags:{
        type:Array,
        default:[]
    },
    likes:{
        type:Array,
        default:[]
    },
    comments:{
        type:Array,
        default:[]
    },
},{timestamps:true});

module.exports=mongoose.model('Posts',Post);