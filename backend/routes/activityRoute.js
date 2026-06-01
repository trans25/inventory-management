const express = require("express")
const router = express.Router()
const protect = require("../middleware/authMiddleware")
const authorize = require("../middleware/roleMiddleware")
const { getActivities } = require("../controllers/activityController")

router.get("/", protect, authorize("admin"), getActivities)

module.exports = router
