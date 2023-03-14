const AWS = require("aws-sdk")
const s3 = new AWS.S3()


exports.createPost=(req,res) => {
  res.status(200).json({
    'messsage':'File Saved',
    'link':`${req.file.filename}`
  })
}