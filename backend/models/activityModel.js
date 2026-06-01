const mongoose = require("mongoose")

const activitySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    userName: {
        type: String
    },
    action: {
        type: String,
        required: true
    },
    entity: {
        type: String
    },
    details: {
        type: String
    }
}, {
    timestamps: true
})

const Activity = mongoose.model("Activity", activitySchema)
module.exports = Activity
