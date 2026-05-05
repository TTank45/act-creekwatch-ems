const fs = require("fs");
const path = require("path");

const systemLogsFilePath = path.join(
  __dirname,
  "../data/systemLogs.json"
);

const latestReadingsFilePath = path.join(
  __dirname,
  "../data/latestReadings.json"
);

const alertsFilePath = path.join(
  __dirname,
  "../data/alerts.json"
);
const telemetryHistoryFilePath = path.join(
  __dirname,
  "../data/telemetryHistory.json"
);

let currentSimulationMode = "NORMAL";
let simulatorEnabled = true;
function readJson(filePath, fallback = []) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return fallback;
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
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

function setSimulationMode(mode) {
  currentSimulationMode = mode;
}

function getSimulationMode() {
  return currentSimulationMode;
}
function setSimulatorEnabled(value) {
  simulatorEnabled = value;
}

function getSimulatorEnabled() {
  return simulatorEnabled;
}

function generateRandomReading(siteName, latitude, longitude) {
  const now = new Date();

  let pH;
  let turbidity;
  let dissolvedOxygen;
  let temperature;
  let eColi;

  // NORMAL CONDITIONS
  if (currentSimulationMode === "NORMAL") {
    pH = (6.5 + Math.random() * 1.5).toFixed(1);

    turbidity = (1 + Math.random() * 5).toFixed(1);

    dissolvedOxygen = (7 + Math.random() * 2).toFixed(1);

    temperature = (16 + Math.random() * 6).toFixed(1);

    eColi = Math.floor(50 + Math.random() * 120);
  }

  // WARNING CONDITIONS
  else if (currentSimulationMode === "WARNING") {
    pH = (6 + Math.random() * 1).toFixed(1);

    turbidity = (5 + Math.random() * 5).toFixed(1);

    dissolvedOxygen = (5 + Math.random() * 2).toFixed(1);

    temperature = (20 + Math.random() * 5).toFixed(1);

    eColi = Math.floor(150 + Math.random() * 200);
  }

  // CRITICAL CONDITIONS
  else if (currentSimulationMode === "CRITICAL") {
    pH = (5 + Math.random()).toFixed(1);

    turbidity = (10 + Math.random() * 10).toFixed(1);

    dissolvedOxygen = (2 + Math.random() * 2).toFixed(1);

    temperature = (25 + Math.random() * 8).toFixed(1);

    eColi = Math.floor(400 + Math.random() * 300);
  }

  // FALLBACK
  else {
    pH = "7.0";
    turbidity = "3.0";
    dissolvedOxygen = "8.0";
    temperature = "20.0";
    eColi = 100;
  }

  return {
    siteName,
    latitude,
    longitude,

    sensorStatus:
  Math.random() < 0.1 ? "OFFLINE" : "ONLINE",

    date: now.toISOString().split("T")[0],

    time: now.toLocaleTimeString("en-AU"),

    pH,

    turbidity,

    dissolvedOxygen,

    temperature,

    eColi,
  };
}

function generateAlerts(rows) {
  const alerts = [];

  rows.forEach((row, index) => {
    const turbidity = Number(row.turbidity);
    const oxygen = Number(row.dissolvedOxygen);
    const eColi = Number(row.eColi);
    const ph = Number(row.pH);

    if (turbidity > 8) {
      alerts.push({
        id: index + 1,
        title: "High Turbidity",
        severity: "High",
        parameter: "Turbidity",
        value: turbidity,
        unit: "NTU",
        location: row.siteName,
        time: `${row.date} ${row.time}`,
        status: "Open",
      });
    }

    if (oxygen < 5) {
      alerts.push({
        id: index + 100,
        title: "Low Dissolved Oxygen",
        severity: "Moderate",
        parameter: "Dissolved Oxygen",
        value: oxygen,
        unit: "mg/L",
        location: row.siteName,
        time: `${row.date} ${row.time}`,
        status: "Open",
      });
    }

    if (eColi > 300) {
      alerts.push({
        id: index + 200,
        title: "High E. coli",
        severity: "High",
        parameter: "E. coli",
        value: eColi,
        unit: "CFU/100mL",
        location: row.siteName,
        time: `${row.date} ${row.time}`,
        status: "Open",
      });
    }

    if (ph < 6.5 || ph > 8.5) {
      alerts.push({
        id: index + 300,
        title: "Abnormal pH",
        severity: "Moderate",
        parameter: "pH",
        value: ph,
        unit: "",
        location: row.siteName,
        time: `${row.date} ${row.time}`,
        status: "Open",
      });
    }
  });

  return alerts;
}

function generateReadingsForAllSites() {
  return [
    generateRandomReading(
      "Yarralumla Creek",
      -35.3075,
      149.1015
    ),

    generateRandomReading(
      "Molonglo River",
      -35.321,
      149.083
    ),

    generateRandomReading(
      "Gungahlin Pond",
      -35.184,
      149.134
    ),
  ];
}

function updateSimulatorData() {
    if (!simulatorEnabled) {
  return;
}
  const readings = generateReadingsForAllSites();

  writeJson(latestReadingsFilePath, readings);
  const history = readJson(telemetryHistoryFilePath, []);

const telemetryEntries = readings.map((reading) => ({
  timestamp: `${reading.date} ${reading.time}`,
  siteName: reading.siteName,
  ph: Number(reading.pH),
  turbidity: Number(reading.turbidity),
  oxygen: Number(reading.dissolvedOxygen),
}));

history.push(...telemetryEntries);

const trimmedHistory = history.slice(-100);

writeJson(telemetryHistoryFilePath, trimmedHistory);

  const alerts = generateAlerts(readings);

  writeJson(alertsFilePath, alerts);

  console.log(
    `[IoT Simulator] Updated readings | Mode: ${currentSimulationMode}`
  );
}

function startIotSimulator() {
  console.log("IoT Simulator Started");

  updateSimulatorData();

  setInterval(() => {
    updateSimulatorData();
  }, 10000);
}

module.exports = {
    
  startIotSimulator,
  setSimulationMode,
  getSimulationMode,
  updateSimulatorData,
  setSimulatorEnabled,
  getSimulatorEnabled,
};