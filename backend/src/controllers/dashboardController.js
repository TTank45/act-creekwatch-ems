const fs = require("fs");
const path = require("path");

const latestReadingsFilePath = path.join(
  __dirname,
  "../data/latestReadings.json"
);
const alertsFilePath = path.join(__dirname, "../data/alerts.json");

function readJsonFile(filePath, fallback = []) {
  try {
    const fileData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileData);
  } catch (error) {
    console.error(`Error reading ${path.basename(filePath)}:`, error);
    return fallback;
  }
}

function readLatestReadings() {
  return readJsonFile(latestReadingsFilePath, []);
}

function readAlerts() {
  return readJsonFile(alertsFilePath, []);
}

function calculateAverage(rows, key) {
  if (!rows.length) return 0;

  const total = rows.reduce((sum, row) => sum + Number(row[key] || 0), 0);
  return Number((total / rows.length).toFixed(2));
}

function buildMonitoringSites(rows) {
  const siteMap = new Map();

  rows.forEach((row, index) => {
    if (!siteMap.has(row.siteName)) {
      const ph = Number(row.pH);
      const turbidity = Number(row.turbidity);
      const eColi = Number(row.eColi);

      let status = "Good";

      if (turbidity > 8 || eColi > 300 || ph < 6.5 || ph > 8.5) {
        status = "Poor";
      } else if (turbidity > 5 || eColi > 150) {
        status = "Moderate";
      }

      siteMap.set(row.siteName, {
        id: index + 1,
        name: row.siteName,
        lat: Number(row.latitude),
        lng: Number(row.longitude),
        status,
      });
    }
  });

  return Array.from(siteMap.values());
}

function buildHistoricalTrends(rows) {
  const groupedByDate = {};

  rows.forEach((row) => {
    const date = row.date;

    if (!groupedByDate[date]) {
      groupedByDate[date] = {
        count: 0,
        phTotal: 0,
        turbidityTotal: 0,
        oxygenTotal: 0,
      };
    }

    groupedByDate[date].count += 1;
    groupedByDate[date].phTotal += Number(row.pH || 0);
    groupedByDate[date].turbidityTotal += Number(row.turbidity || 0);
    groupedByDate[date].oxygenTotal += Number(row.dissolvedOxygen || 0);
  });

  return Object.entries(groupedByDate)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .slice(-7)
    .map(([date, values]) => ({
      date,
      ph: Number((values.phTotal / values.count).toFixed(2)),
      turbidity: Number((values.turbidityTotal / values.count).toFixed(2)),
      oxygen: Number((values.oxygenTotal / values.count).toFixed(2)),
    }));
}

const getPublicDashboard = (req, res) => {
  const rows = readLatestReadings();
  const alerts = readAlerts();

  if (!rows.length) {
    return res.json({
      creekHealthStatus: "Good",
      summary: {
        ph: 7.2,
        turbidity: 3.8,
        dissolvedOxygen: 8.4,
        temperature: 18.6,
        eColi: 110,
      },
      monitoringSites: [],
      historicalTrends: [],
      recentAlerts: [],
    });
  }

  const avgPh = calculateAverage(rows, "pH");
  const avgTurbidity = calculateAverage(rows, "turbidity");
  const avgOxygen = calculateAverage(rows, "dissolvedOxygen");
  const avgTemperature = calculateAverage(rows, "temperature");
  const avgEColi = calculateAverage(rows, "eColi");

  let creekHealthStatus = "Good";

  if (avgTurbidity > 8 || avgEColi > 300 || avgPh < 6.5 || avgPh > 8.5) {
    creekHealthStatus = "Poor";
  } else if (avgTurbidity > 5 || avgEColi > 150) {
    creekHealthStatus = "Moderate";
  }

  res.json({
  creekHealthStatus,
  summary: {
    ph: avgPh,
    turbidity: avgTurbidity,
    dissolvedOxygen: avgOxygen,
    temperature: avgTemperature,
    eColi: avgEColi,
  },
  monitoringSites: buildMonitoringSites(rows),
  historicalTrends: buildHistoricalTrends(rows),
  recentAlerts: alerts.slice(0, 5),
  latestReadings: rows,
});
};

module.exports = {
  getPublicDashboard,
};