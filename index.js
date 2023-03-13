
//requirements
const express=require('express')
const bcrypt=require('bcrypt')
//const S3 = require("@aws-sdk/client-s3")
const AWS = require("aws-sdk");
const s3 = new AWS.S3()
const cors=require('cors')
const mongoose = require("mongoose")
const env=require('dotenv')
const router = require("express").Router();
const multer = require('multer')
//const multerS3 = require('multer-s3')
const crypto = require('crypto')
const { createPost, getFile } = require('./helper/helper')



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
  `mongodb+srv://${process.env.USERID}:${process.env.PASSWORD}@${process.env.DATABASE}/?retryWrites=true&w=majority`,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
).then(()=>{
    console.log("Database Connected");
})

const storage=multer.diskStorage({
  filename:(req,file,cb)=>{
      let cx=file.originalname.split('.');
      cb(null,Date.now().toString() + '-' + crypto.randomBytes(20).toString('hex') + `.${cx[cx.length-1]}`);
  }
})
const upload=multer({storage:storage});

router.get('/',(req,res)=>{
    res.status(200).json({
        'messsage':'Hey Buddy working great',
    })
});
router.put('/addPost',upload.single('filePath'),createPost);
router.get('/viewFile',getFile);

app.listen(process.env.PORT,()=>{
    console.log(`Server Running Successfully`);
});