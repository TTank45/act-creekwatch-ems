const express = require("express");

const {
  getAlerts,
  getAlertById,
} = require("../controllers/alertController");

const router = express.Router();

router.get("/", getAlerts);

router.get("/:id", getAlertById);

module.exports = router;