const mongoose = require("mongoose");
const bcrypt =require("bcryptjs")
const userSchema = mongoose.Schema({

    name:{
        type:String,
        required:[true,"Please add a name"]
    },
    email:{
        type:String,
        required:[true,"Please add an email"],
        unique:true,
        trim:true,
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
       // minLength: [6, "Password must be at least 6 characters"],
       // maxLength: [23, "Password must not be more than 23 characters"]
    }
    ,
    image:{
        type:String,
        required:[true,"Please add an image"],
        default:"no image"
    },
    phone:{
        type:String,
       
        default:"+27"
    },
    bio:{
        type:String,
        maxLength:[250,"Password must not be more than 250 characters"],
        default:"bio"
        
    }
}, {
    timestamps:true
});

//Encrypt password before saving to db
userSchema.pre("save",async function(next){

    //to not change password when updating profile
    if(!this.isModified("password")){
        return next()
    }
 
    //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword
  next()
});

const User =mongoose.model("User", userSchema);
module.exports = User;
