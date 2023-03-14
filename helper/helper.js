exports.createPost=(req,res) => {
  res.status(200).json({
    'messsage':'File Saved',
    'link':`${req.file.filename}`
  })
}