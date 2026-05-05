const express = require("express");

const {
  triggerPollutionSpike,
  toggleSimulator,
  restoreNormalConditions,
} = require("../controllers/simulatorController");

const router = express.Router();

router.post("/pollution-spike", triggerPollutionSpike);

router.post("/toggle", toggleSimulator);

router.post("/restore-normal", restoreNormalConditions);

module.exports = router;