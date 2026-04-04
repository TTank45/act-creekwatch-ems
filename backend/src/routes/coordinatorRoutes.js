const express = require("express");
const router = express.Router();
const {
  getCoordinatorDashboard,
} = require("../controllers/coordinatorController");

router.get("/", getCoordinatorDashboard);

module.exports = router;