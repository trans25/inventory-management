const dotenv =require("dotenv").config()
const express=require("express")
const http=require("http")
const { Server }=require("socket.io")
const mongoose=require("mongoose")
const cookieParser =require("cookie-parser")
const cors=require("cors")
const errorHandler = require("./middleware/errorMiddleware")
const userRoute=require("./routes/userRoute")
const productRoute=require("./routes/productRoute")
const categoryRoute=require("./routes/categoryRoute")
const orderRoute=require("./routes/orderRoute")
const activityRoute=require("./routes/activityRoute")
const app =express()

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"

//middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}))


//Routes
app.get("/",(req,res)=>{
res.send("home")
})

//route middleware
app.use("/api/users", userRoute)
app.use("/api/products", productRoute)
app.use("/api/categories", categoryRoute)
app.use("/api/orders", orderRoute)
app.use("/api/activities", activityRoute)

//error middleware
app.use(errorHandler)



const PORT =process.env.PORT || 5000;

//create http server and attach socket.io for real-time updates
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true
  }
})
app.set("io", io)

io.on("connection", (socket) => {
  console.log(`socket connected: ${socket.id}`)
  socket.on("disconnect", () => {
    console.log(`socket disconnected: ${socket.id}`)
  })
})


//connect to db
mongoose.connect(process.env.DB_URI)
.then(()=>{
  server.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
  })
})
.catch((error)=>console.log(error))