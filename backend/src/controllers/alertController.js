const fs = require("fs");
const path = require("path");

const alertsFilePath = path.join(__dirname, "../data/alerts.json");
const latestReadingsFilePath = path.join(__dirname, "../data/latestReadings.json");

function readJsonFile(filePath, fallback = []) {
  try {
    const fileData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileData);
  } catch (error) {
    console.error(`Error reading ${path.basename(filePath)}:`, error);
    return fallback;
  }
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing ${path.basename(filePath)}:`, error);
  }
}

function readLatestReadings() {
  return readJsonFile(latestReadingsFilePath, []);
}

function readAlerts() {
  return readJsonFile(alertsFilePath, []);
}

function generateAlerts(rows) {
  const alerts = [];

  rows.forEach((row) => {
    const turbidity = Number(row.turbidity);
    const oxygen = Number(row.dissolvedOxygen);
    const eColi = Number(row.eColi);
    const ph = Number(row.pH);

    const baseData = {
      location: row.siteName,
      time: `${row.date} ${row.time}`,
      description: `Reading recorded at ${row.siteName} triggered an environmental alert based on threshold rules.`,
      status: "Open",
    };

    if (turbidity > 8) {
      alerts.push({
        id: alerts.length + 1,
        title: "High Turbidity",
        severity: "High",
        parameter: "Turbidity",
        value: turbidity,
        unit: "NTU",
        ...baseData,
      });
    }

    if (oxygen < 6) {
      alerts.push({
        id: alerts.length + 1,
        title: "Low Dissolved Oxygen",
        severity: "Moderate",
        parameter: "Dissolved Oxygen",
        value: oxygen,
        unit: "mg/L",
        ...baseData,
      });
    }

    if (eColi > 300) {
      alerts.push({
        id: alerts.length + 1,
        title: "High E. coli",
        severity: "High",
        parameter: "E. coli",
        value: eColi,
        unit: "CFU/100mL",
        ...baseData,
      });
    }

    if (ph < 6.5 || ph > 8.5) {
      alerts.push({
        id: alerts.length + 1,
        title: "Abnormal pH",
        severity: "Moderate",
        parameter: "pH",
        value: ph,
        unit: "",
        ...baseData,
      });
    }
  });

  return alerts;
}

function saveAlertsFromRows(rows) {
  const alerts = generateAlerts(rows);
  writeJsonFile(alertsFilePath, alerts);
  return alerts;
}

const getAllAlerts = (req, res) => {
  const alerts = readAlerts();

  if (alerts.length > 0) {
    return res.json(alerts);
  }

  const rows = readLatestReadings();
  const generatedAlerts = generateAlerts(rows);
  res.json(generatedAlerts);
};

const getAlertById = (req, res) => {
  const alertId = parseInt(req.params.id, 10);
  const alerts = readAlerts();

  const sourceAlerts =
    alerts.length > 0 ? alerts : generateAlerts(readLatestReadings());

  const alert = sourceAlerts.find((item) => item.id === alertId);

  if (!alert) {
    return res.status(404).json({
      message: "Alert not found",
    });
  }

  res.json(alert);
};

module.exports = {
  getAllAlerts,
  getAlertById,
  generateAlerts,
  saveAlertsFromRows,
};