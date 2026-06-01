const asyncHandler = require("express-async-handler")
const Activity = require("../models/activityModel")

//get all activities (admin only)
const getActivities = asyncHandler(async (req, res) => {
    const activities = await Activity.find()
        .sort("-createdAt")
        .limit(200)
    res.status(200).json(activities)
})

module.exports = {
    getActivities
}
