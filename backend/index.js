const dotenv =require("dotenv").config()
const express=require("express")
const mongoose=require("mongoose")
const cookieParser =require("cookie-parser")
const cors=require("cors")
const errorHandler = require("./middleware/errorMiddleware")
const userRoute=require("./routes/userRoute")
const app =express()

//middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))
app.use(cors())


//Routes
app.get("/",(req,res)=>{
res.send("home")
})

//error middleware
app.use(errorHandler)

//route middleware
app.use("/api/users", userRoute)



const PORT =process.env.PORT || 5000;



//connect to db
mongoose.connect(process.env.DB_URI)
.then(()=>{
  app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
  })
})
.catch((error)=>console.log(error))