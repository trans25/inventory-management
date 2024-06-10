const express=require("express")
const router=express.Router();
const {registerUser}=require("../controllers/userController")
const {loginUser}=require("../controllers/userController")
const {logout}=require("../controllers/userController")
const {getUser}=require("../controllers/userController")
const protect=require("../middleware/authMiddleware")
const {loginStatus}=require("../controllers/userController")
const {updateUser}=require("../controllers/userController")
const {changePassword}=require("../controllers/userController")
const {forgotPassword}=require("../controllers/userController")




//creating a user 
router.post("/register",registerUser)

//login a user
router.post("/login",loginUser)

//logout a user
router.get("/logout",logout)
router.get("/getUser",protect,getUser)
//user login status
router.get("/loginStatus",loginStatus)

//updating user profile
router.patch("/updateUser",protect,updateUser);

//change password
router.patch("/changePassword",protect,changePassword);

//reset password
router.post("/forgotPassword",forgotPassword);
module.exports= router