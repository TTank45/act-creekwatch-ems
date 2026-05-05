const fs = require("fs");
const path = require("path");

const {
  setSimulationMode,
  setSimulatorEnabled,
} = require("../services/iotSimulator");

const alertsFilePath = path.join(
  __dirname,
  "../data/alerts.json"
);

const systemLogsFilePath = path.join(
  __dirname,
  "../data/systemLogs.json"
);

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function readJson(filePath, fallback = []) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return fallback;
  }
}

function addSystemLog(message) {
  const logs = readJson(systemLogsFilePath, []);

  logs.unshift({
    id: Date.now(),
    message,
    time: new Date().toLocaleTimeString("en-AU"),
  });

  writeJson(systemLogsFilePath, logs.slice(0, 20));
}

const triggerPollutionSpike = (req, res) => {
  setSimulationMode("CRITICAL");

  addSystemLog("Critical pollution event triggered");

  const alerts = readJson(alertsFilePath, []);

  alerts.unshift({
    id: Date.now(),
    type: "Critical Pollution Event",
    site: "Multiple Creek Sites",
    severity: "High",
    timestamp: new Date().toISOString(),
  });

  writeJson(alertsFilePath, alerts);

  res.json({
    message: "Critical pollution event triggered",
  });
};

const restoreNormalConditions = (req, res) => {
  setSimulationMode("NORMAL");

  addSystemLog("System restored to normal");

  res.json({
    message: "System restored to normal conditions",
  });
};

const toggleSimulator = (req, res) => {
  const { enabled } = req.body;

  setSimulatorEnabled(enabled);

  addSystemLog(
    enabled
      ? "Simulator enabled"
      : "Simulator disabled"
  );

  res.json({
    simulatorEnabled: enabled,
  });
};

module.exports = {
  triggerPollutionSpike,
  restoreNormalConditions,
  toggleSimulator,
};