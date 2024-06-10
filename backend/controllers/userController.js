
const asyncHandler=require("express-async-handler")
const User =require("../models/userModel")
const jwt=require("jsonwebtoken")
const bcrypt =require("bcryptjs")
const Token =require("../models/tokenModel")
const crypto = require('crypto');
const sendEmail = require("../utils/sendEmail")

//generate a token

const generateToken =(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1d"})
};


//register user
const registerUser =asyncHandler( async (req,res)=>{

  const {name,email,password}=req.body

  // validation
  if(!name || !email || !password){
res.status(400)
throw new Error("Please fill all required fields")
  }
  if(password.length < 6){
    res.status(400)
    throw new Error("Password must be uo to 6 characters") 
  };

  //check if user email already exists
  const userExists = await User.findOne({email})

  if(userExists){
    res.status(400)
    throw new Error("Email has already been registered")
  }

 
  
//create new User

const user =await User.create({
    name,
    email,
    password,
})
//generate token
const token =generateToken(user._id)

//send HTTP-only cookie to frontend
res.cookie("token",token,{
    path:"/",
    httpOnly:true,
    expires:new Date(Date.now()+1000 * 86400),//1 day
    sameSite:"none",
    secure:true
})

if(user){
    const {_id,name,email,image,phone,bio}=user
    res.status(201).json({
      
      _id,
      name,
      email,
      image,
      phone,
      bio,
      token
    })
}
else{
    res.status(400)
throw new Error("Invalid user Data")
}

});

//Login User 

const loginUser =  asyncHandler(async(req,res) => {
  const {email,password}=req.body
  //validate request

  if(!email || !password){
    res.status(400)
    throw new Error("Please add email and password")
}
// check if user exists
const user = await User.findOne({email})
if(!user){
    res.status(400)
    throw new Error("User not found please register")
}
  
//User exists, check if password if correct

const passwordIsCorrect = await bcrypt.compare(password,user.password);
//generate token
const token =generateToken(user._id)

//send HTTP-only cookie to frontend
res.cookie("token",token,{
    path:"/",
    httpOnly:true,
    expires:new Date(Date.now()+1000 * 86400),//1 day
    sameSite:"none",
    secure:true
})

if(user && passwordIsCorrect){
    const {_id,name,email,image,phone,bio}=user
    res.status(200).json({
      
      _id,
      name,
      email,
      image,
      phone,
      bio,
      token
      
    })
}
else{
    res.status(400);
    throw new Error("Invalid email or password")
}


});

//logout user
const logout =asyncHandler(async(req,res)=>{
    res.cookie("token","",{
        path:"/",
        httpOnly:true,
        expires:new Date(0),
        sameSite:"none",
        secure:true
    })
    return res.status(200).json({message:"successfully logged out"})
})

//get user Data

const getUser =  asyncHandler(async (req,res)=>{
  
const user = await User.findById(req.user._id)
if(user){
    const {_id,name,email,image,phone,bio}=user
    res.status(201).json({
      
      _id,
      name,
      email,
      image,
      phone,
      bio,
      
    })
}
else{
    res.status(400)
throw new Error("User not found")
}

});


//get login status

const loginStatus =asyncHandler(async(req,res)=>{

  const token =req.cookies.token;
  if(!token){
    return res.json(false)
  }
    //verify token
    const verified =jwt.verify(token,process.env.JWT_SECRET)
    if(verified){
      return res.json(true)
    }
    return res.json(false)

});


//update user
const updateUser =asyncHandler(async(req, res) => {
  
const user =await User.findById(req.user._id)
if(user){
  const {name,email,image,phone,bio}=user;

  user.email=email;
  user.name=req.body.name || name;
  user.phone=req.body.phone || phone;
  user.image=req.body.image|| image;
  user.bio=req.body.bio || bio;

  const updatedUser =await user.save()
  res.status(200).json({
    _id:updatedUser._id ,
  name:updatedUser.name,
  email:updatedUser.email,
  image:updatedUser.image,
  phone:updatedUser.phone,
    bio:updatedUser.bio
  })

}else{
  res.status(404)
  throw new Error("User not found")
}
});

//change password

const changePassword=asyncHandler(async(req,res)=>{
  const user=await User.findById(req.user._id)

  if(!user){
    res.status(400)
    throw new Error("User not found, please sign up")
  }
  const {oldPassword,password}=req.body;

  //validate
  if(!oldPassword || !password){
    res.status(400)
    throw new Error("Please add old and new password")
  }

  //check if old password  entered match the one in database

  const passwordIsCorrect =await bcrypt.compare(oldPassword,user.password)

  //save new password
  if(user && passwordIsCorrect){
    user.password=password
    await user.save()
    res.status(200).send("password change successful")
  }
  else{
    res.status(400)
    throw new Error("old password is incorrect")
  }

})
//reset password

const forgotPassword=asyncHandler(async(req,res)=>{
 const {email}=req.body
 const user =await User.findOne({email})
 if(!user){

  res.status(404)
  throw new Error("User does not exist")
 }

 //Delete token if it exists in the DB
 let token = await Token.findOne({userId:user._id})
 if(token){
  await token.deleteOne()
 }

 // create reset token
 let resetToken =crypto.randomBytes(32).toString("hex") + user._id
console.log(resetToken);
//hash token ,then compare to the one in database
const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")
console.log(hashedToken)


//save token to db
await new Token({
  userId:user._id,
  token:hashedToken,
  createdAt:Date.now(),
  expiresAt:Date.now() + 30 * (60 * 1000)//30 minutes
}).save()


//construct reset url

const resetUrl = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`

// reset email

const message = `
<h2> Hello ${user.name}</h2>

<p> Please use the url below to reset your password</p>


<p> Reset link is valid for only 30 minutes</p>


<a href =${resetUrl} clickTracking = off >${resetUrl}</a>


<p>Regards...</p>
<p>mashia-ES</p>

`;

const subject ="Password reset Request";
const send_to =user.email;
const sent_from =process.env.EMAIL_USER;


try {
  await sendEmail(subject,message,send_to,sent_from)
  res.status(200).json({success:true,message:"Reset Email Sent"})
} catch (error) {
  res.status(500)
  throw new Error("Email not sent, Please try again")
}
})

//reset password

const resetPassword=asyncHandler(async(req,res)=>{
  const {password}=req.body;
  const {resetToken}=req.params

  
//hash token ,then compare to the one in database
const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

//find token in db
const userToken =await Token.findOne({
  token:hashedToken,
  expiresAt:{$gt: Date.now()}
})
if(!userToken){
  res.status(404)
  throw new Error("Invalid or Expired Token")
}
//find user
const user =await User.findOne({_id:userToken.userId})
user.password = password
await user.save()
res.status(200).json({message:"Password Reset successful, Please Login"})
})

module.exports={
    registerUser,
    loginUser,
    logout,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword
}