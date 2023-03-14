
//requirements
const express=require('express')
const cors=require('cors')
const mongoose = require("mongoose")
const env=require('dotenv')
const router = require("express").Router();
const multer = require('multer')
const crypto = require('crypto')
const { createPost } = require('./helper/helper')



//server create
const app = express()

//necessart configs
env.config();
app.use(cors());
app.use(router);
router.use(express.json());
app.use(express.urlencoded({ extended: false }));

//mongoose initialise
mongoose.set('strictQuery', false);
var conn=mongoose.connect(
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
app.use('/uploads',express.static('./src/uploads'));

router.get('/',(req,res)=>{
    res.status(200).json({
        'messsage':'Hey Buddy working great',
    })
});
router.put('/addPost',upload.single('filePath'),createPost);

app.listen(process.env.PORT,()=>{
    console.log(`Server Running Successfully at port ${process.env.PORT}`);
});