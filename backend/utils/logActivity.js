const Activity = require("../models/activityModel")

// record an activity. never throws, so logging can't break the main request.
const logActivity = async (req, { action, entity, details }) => {
    try {
        await Activity.create({
            user: req.user?._id,
            userName: req.user?.name,
            action,
            entity,
            details
        })
    } catch (error) {
        console.log("Failed to log activity:", error.message)
    }
}

module.exports = logActivity
