const AWS = require("aws-sdk")
const s3 = new AWS.S3()


exports.createPost=async (req,res) => {
    await s3.putObject({
      Body: JSON.stringify(req.file),
      Bucket: process.env.AWS_BUCKET,
      Key: req.file.filename,
    }).promise().then((results,err)=>{
        if(results){
            res.status(200).json({
                'messsage':'Successfully upload',
                'link':`https://cyclic-good-plum-snapper-kit-eu-west-1.s3.amazonaws.com/${req.file.filename}`
            })
        }
        
        res.status(404).json({
            'messsage':'Error',
            'link':`https://cyclic-good-plum-snapper-kit-eu-west-1.s3.amazonaws.com/${req.file.filename}`
        })
    
        
    })
  
    
}


exports.getFile=async (req,res) => {
    try {
        let s3File = await s3.getObject({
        Bucket: process.env.AWS_BUCKET,
          Key: req.query.filename,
        }).promise()
    
        res.set('Content-type', s3File.ContentType)
        res.send(s3File.Body.toString()).end()
      } catch (error) {
        if (error.code === 'NoSuchKey') {
          console.log(`No such key ${req.query.filename}`)
          res.sendStatus(404).end()
        } else {
          console.log(error)
          res.sendStatus(500).end()
        }
      }
  
    
  }