
const post_model = require("../model/post_model")
const user_model = require("../model/user_model")
const crypto=require('crypto')
const chatmodel = require("../model/chatmodel")


exports.checkserver=(req,res)=>{
  console.log('/get checkserver')
  console.log({body:req.body,file:req.file})
  return res.status(200).json({
      'messsage':'Hey Buddy working great',
  })
}


exports.signupuser=(req,res) => {
  console.log('/post signupuser')
  console.log({body:req.body,file:req.file})
  if(req.body.name==null||req.body.email==null||req.body.password==null||req.body.dob==null||req.body.userId==null)
  {
    return res.status(404).json({
      'messsage':'Params Incorrect',
    })
  }

  let newUser = new user_model
  newUser.userId=req.body.userId
  newUser.name = req.body.name
  newUser.email = req.body.email
  newUser.password=newUser.setPassword(req.body.password)
  newUser.dob=req.body.dob
  

  newUser.save().then(result=>{
    return res.status(200).send({ 
    message : "User added successfully.",
    user: result
  })},error=>{
    return res.status(400).send({ 
    message : "Failed to add user.",
    error:error
  })})
  
}

exports.login=(req,res) => {
  console.log('/post login')
  console.log({body:req.body,file:req.file})
  if(req.body.email==null||req.body.password==null)
    {
      return res.status(404).json({
        'messsage':'Params Incorrect',
      })
    }

    user_model.findOne({ email : req.body.email }).then(
      result=>{

        if (result.checkValidpassword(req.body.password,result.password)) { 
            return res.status(201).send({ 
                message : "User Logged In",
                user: result
            }) 
        } 
        else { 
            return res.status(400).send({ 
                message : "Wrong credentials"
            }); 
        }
      },
      error=>{
        return res.status(201).send({ 
          message : "User not found",
          error: error
      })}
    )
}

exports.createPost=(req,res) => {
  console.log('/post createpost')
  console.log({body:req.body,file:req.file})
  if(req.file.filename==null||req.body.userId==null)
    {
      return res.status(404).json({
        'messsage':'Params Incorrect',
      })
    }
  

  post_model.create({imageId:req.file.filename,userId:req.body.userId,tags:req.body.tags==null?[]:req.body.tags.split(','),title:req.body.title}).then(
    result=>{
      return res.status(200).json({
        message:'Post Created Successfully',
        data:result
      })
    },
    error=>{
      return res.status(400).json({
        message:'error',
        err:error
      })
    })
}


exports.findAllposts=async(req,res)=>{
  console.log('/post findallposts')
  console.log({body:req.body,file:req.file})
  var result=await post_model.find({userId:req.body.userId}).exec()
  
  var result2=await post_model.find({tags: { $all: req.body.userId }}).exec()

  return res.status(200).json({
    message:'Post Data',
    posted:result,
    tagged:result2
  })

}


exports.delpost=(req,res)=>{
  console.log('/delete delpost')
  console.log({body:req.body,file:req.file})
  post_model.deleteOne({_id:req.body.postId},{returnOriginal:false}).then(
    result2=>{
      return res.status(200).json({
        message:'Post Deleted',
        tagged:result2
      })
    },
    error=>{
      return res.status(400).json({
        message:'error',
        err:error
    })
  })
}

exports.makecomment=(req,res) => {
  console.log('/post makecomment')
  console.log({body:req.body,file:req.file})
  if(req.body.postId==null||req.body.userId==null||req.body.message==null)
    {
      return res.status(404).json({
        'messsage':'Params Incorrect',
      })
    }
  

  post_model.updateOne({_id:req.body.postId},{$addToSet:{ comments: {_id:Date.now().toString() + crypto.randomBytes(20).toString('hex'),message:req.body.message,userId:req.body.userId,likes:0} }}).then(
    result=>{
      return res.status(200).json({
        message:'Post Created Successfully',
        data:result
      })
    },
    error=>{
      return res.status(400).json({
        message:'error',
        err:error
      })
    })
}


exports.delcomment=(req,res)=>{
  console.log('/delete delcomment')
  console.log({body:req.body,file:req.file})
  post_model.updateOne({_id:req.body.postId},{ $pull: { comments: { _id: req.body.commentId } } },).then(
    result2=>{
      return res.status(200).json({
        message:'Comment Deleted',
        tagged:result2
      })
    },
    error=>{
      return res.status(400).json({
        message:'error',
        err:error
    })
  })
}



exports.liked=(req,res)=>{
  console.log('/post liked')
  console.log({body:req.body,file:req.file})
  post_model.updateOne({_id:req.query.postId},{ $addToSet: { likes: req.query.userId } }).then(
    result2=>{
      return res.status(200).json({
        message:'Post Liked',
      })
    },
    error=>{
      return res.status(400).json({
        message:'error',
        err:error
    })
  })
}

exports.followuser=(req,res)=>{
  console.log('/get followuser')
  console.log({body:req.body,file:req.file})
  user_model.updateOne({userId:req.query.userId},{ $addToSet: { followslist: req.query.followId } }).then(
    result2=>{


      user_model.updateOne({userId:req.query.followId},{ $addToSet: { followerlist: req.query.userId } }).then(
        result2=>{
          return res.status(200).json({
            message:'Followed Successfully',
          })
        },
        error=>{
          return res.status(400).json({
            message:'error',
            err:error
        })
      })

      
    },
    error=>{
      return res.status(400).json({
        message:'error',
        err:error
    })
  })
}

exports.unfollowuser=(req,res)=>{
  console.log('/get followuser')
  console.log({body:req.body,file:req.file})
  user_model.updateOne({userId:req.query.userId},{ $pull: { followslist: req.query.followId } }).then(
    result2=>{


      user_model.updateOne({userId:req.query.followId},{ $pull: { followerlist: req.query.userId } }).then(
        result2=>{
          return res.status(200).json({
            message:'UnFollowed Successfully',
          })
        },
        error=>{
          return res.status(400).json({
            message:'error',
            err:error
        })
      })

      
    },
    error=>{
      return res.status(400).json({
        message:'error',
        err:error
    })
  })
}

exports.addStory=(req,res)=>{
  console.log('/post addstory')
  console.log({body:req.body,file:req.file})

  if(req.file.filename==null||req.body.tag==null||req.body.userId==null)
    {
      return res.status(404).json({
        'messsage':'Params Incorrect',
      })
    }



    user_model.updateOne({userId:req.body.userId},{$addToSet:{status:{imageId:req.file.filename,tag:req.body.tag,}}}).then(
      result2=>{
        return res.status(200).json({
          message:'Status added Successfully',
        })
      },
      error=>{
        return res.status(400).json({
          message:'error',
          err:error
      })
    })
}

//chat items
exports.addchat=(req,res)=>{
  console.log('/post addchat')
  console.log({body:req.body,file:req.file})

  if(req.body.recId==null||req.body.sendId==null||req.body.text==null)
    {
      return res.status(404).json({
        'messsage':'Params Incorrect',
      })
    }

  chatmodel.create({recId:req.body.recId,sendId:req.body.sendId,text:req.body.text}).then(
      result2=>{
        return res.status(200).json({
          message:'Message Sent',
          
        })
      },
      error=>{
        return res.status(400).json({
          message:'error',
          err:error
      })
    })
}

exports.attchat=(req,res)=>{
  console.log('/post attchat')
  console.log({body:req.body,file:req.file})

  if(req.body.recId==null||req.body.sendId==null||(req.file.filename==null && req.body.text==null))
    {
      return res.status(404).json({
        'messsage':'Params Incorrect',
      })
    }

  chatmodel.create({recId:req.body.recId,sendId:req.body.sendId,text:req.body.text==null?'':req.body.text,imageId:req.file.filename==null?'':req.file.filename,isonetime:req.body.onetime==null?false:req.body.onetime}).then(
      result2=>{
        return res.status(200).json({
          message:'Message Sent',
          
        })
      },
      error=>{
        return res.status(400).json({
          message:'error',
          err:error
      })
    })
}

exports.deletechat=(req,res)=>{
  console.log('/get deletechat')
  console.log({body:req.body,file:req.file})
  if(req.query.chatId==null)
    {
      return res.status(404).json({
        'messsage':'Params Incorrect',
      })
    }

  

  chatmodel.updateOne({_id:req.query.chatId},{isdeleted:true}).then(
      result2=>{
        return res.status(200).json({
          message:'Deleted Chat Successfully',
        })
      },
      error=>{
        return res.status(400).json({
          message:'error',
          err:error
      })
    })
}

exports.profilepicupload=(req,res)=>{
  console.log('/post profilepicupload')
  console.log({body:req.body,file:req.file})
  user_model.updateOne({userId:req.query.userId},{ profileId: req.file.filename }).then(
    result2=>{
      return res.status(200).json({
        message:'Profile pic uploaded',
      })
    },
    error=>{
      return res.status(400).json({
        message:'error',
        err:error
    })
  })
}