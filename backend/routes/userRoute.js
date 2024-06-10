const express=require("express")
const router=express.Router();
const {registerUser}=require("../controllers/userController")
const {loginUser}=require("../controllers/userController")
const {logout}=require("../controllers/userController")
const {getUser}=require("../controllers/userController")
const protect=require("../middleware/authMiddleware")
const {loginStatus}=require("../controllers/userController")


router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/logout",logout)
router.get("/getUser",protect,getUser)
router.get("/loginStatus",loginStatus)
module.exports= router