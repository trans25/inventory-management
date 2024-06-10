
const asyncHandler=require("express-async-handler")
const User =require("../models/userModel")
const jwt=require("jsonwebtoken")
const bcrypt =require("bcryptjs")

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
    res.send("login status")
});


module.exports={
    registerUser,
    loginUser,
    logout,
    getUser,
    loginStatus
}