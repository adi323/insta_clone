
//requirements
const express=require('express')
const cors=require('cors')
const mongoose = require("mongoose")
const env=require('dotenv')
const router = require("express").Router();
const multer = require('multer')
const crypto = require('crypto')
const { createPost, checkserver, signupuser, login, findAllposts, delpost, makecomment, liked, delcomment, likecomment, followuser, addStory, unfollowuser, addchat, deletechat, profilepicupload, attchat } = require('./helper/helper')


//server create
const app = express()

//necessart configs
env.config();
app.use(cors());
app.use(router);
router.use(express.json());
app.use(express.urlencoded({ extended: true }));


//mongoose initialise
mongoose.set('strictQuery', false);
mongoose.connect(
  `mongodb+srv://${process.env.USERID}:${process.env.PASSWORD}@${process.env.DATABASE_MONGODB}/?retryWrites=true&w=majority`,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
).then(()=>{
    console.log("Database Connected");
})




const storage=multer.diskStorage({
    destination:"./uploads/",
    filename:(req,file,cb)=>{
        let cx=file.originalname.split('.');
        cb(null,Date.now().toString() + '-' + crypto.randomBytes(20).toString('hex') + `.${cx[cx.length-1]}`);
    }
})
const upload=multer({storage:storage});
app.use('/uploads',express.static('./uploads'));




router.get('/',checkserver);
router.post('/signup',signupuser);
router.post('/login',login);
router.post('/createpost', upload.single('filePath'),createPost);
router.post('/findall',findAllposts);
router.delete('/delpost',delpost);

router.post('/makecomment',makecomment);
router.delete('/delcomment',delcomment);

router.get('/likepost',liked);

router.get('/follow',followuser);
router.get('/unfollow',unfollowuser);

//chats full with socket and storyshow
router.post('/addstory',upload.single('filePath'),addStory);
router.post('/addchat',addchat);
router.post('/attchat',upload.single('filePath'),attchat);
router.get('/delchat',deletechat);
router.post('/uploadprofileimage',upload.single('filePath'),profilepicupload);




//websocket realtime message
const https=require('http').createServer(app);
const io=require('socket.io')(https,{});
var clients=[]

io.on("connection",(socket)=>{
    socket.on("signin",(id)=>{
        clients[id]=socket
    })
    socket.on("message",(msg)=>{
        var id=msg.recUser
        if(clients[id]){
            clients[msg.recUser].emit("message",msg);
        }
    })
});




https.listen(process.env.PORT,()=>{
    console.log(`Server Running Successfully at port ${process.env.PORT}`);
});