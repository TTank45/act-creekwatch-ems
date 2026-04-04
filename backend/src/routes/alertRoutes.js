const express = require("express");
const router = express.Router();
const {
  getAllAlerts,
  getAlertById,
} = require("../controllers/alertController");

router.get("/", getAllAlerts);
router.get("/:id", getAlertById);

module.exports = router;