const mongoose=require('mongoose')

const Chat=mongoose.Schema({
    recId:{
        type:String,
        required:true
    },
    sendId:{
        type:String,
        required:true
    },
    imageId:{
        type:String,
        default:''
    },
    text:{
        type:String,
        default:''
    },
    isdeleted:{
        type:Boolean,
        default:false
    },
    isread:{
        type:Boolean,
        default:false
    },
    isonetime:{
        type:Boolean,
        default:false
    },
},{timestamps:true});

module.exports=mongoose.model('Chats',Chat);