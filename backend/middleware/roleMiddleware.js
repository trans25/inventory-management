const asyncHandler = require("express-async-handler")

// usage: authorize("admin"), authorize("admin", "manager")
const authorize = (...roles) => {
    return asyncHandler(async (req, res, next) => {
        if (!req.user) {
            res.status(401)
            throw new Error("Not authorized, please login")
        }
        if (!roles.includes(req.user.role)) {
            res.status(403)
            throw new Error("Not authorized for this action")
        }
        next()
    })
}

module.exports = authorize
