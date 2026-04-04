const express = require("express");
const router = express.Router();
const {
  getPublicDashboard,
} = require("../controllers/dashboardController");

router.get("/", getPublicDashboard);

module.exports = router;