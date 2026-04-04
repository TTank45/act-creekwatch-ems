const express = require("express");
const router = express.Router();
const {
  getVolunteerDashboard,
} = require("../controllers/volunteerController");

router.get("/", getVolunteerDashboard);

module.exports = router;