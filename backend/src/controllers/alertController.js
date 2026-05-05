const fs = require("fs");
const path = require("path");

const alertsFilePath = path.join(
  __dirname,
  "../data/alerts.json"
);

function readAlerts() {
  try {
    const data = fs.readFileSync(alertsFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading alerts:", error);
    return [];
  }
}

const getAlerts = (req, res) => {
  const alerts = readAlerts();

  res.json(alerts);
};

const getAlertById = (req, res) => {
  const alerts = readAlerts();
  const alert = alerts.find(
    (a) => a.id === Number(req.params.id)
  );

  if (!alert) {
    return res.status(404).json({
      message: "Alert not found",
    });
  }

  res.json(alert);
};

module.exports = {
  getAlerts,
  getAlertById,
};