const fs = require("fs");
const path = require("path");

const uploadsFilePath = path.join(__dirname, "../data/uploads.json");
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

function countUniqueSites(readings) {
  const uniqueSites = new Set();

  readings.forEach((row) => {
    if (row.siteName) {
      uniqueSites.add(row.siteName);
    }
  });

  return uniqueSites.size;
}

const getCoordinatorDashboard = (req, res) => {
  try {
    const uploads = readJsonFile(uploadsFilePath, []);
    const alerts = readJsonFile(alertsFilePath, []);
    const latestReadings = readJsonFile(latestReadingsFilePath, []);

    const coordinatorDashboard = {
      summary: {
        totalUploads: uploads.length,
        totalAlerts: alerts.length,
        totalMonitoringSites: countUniqueSites(latestReadings),
        currentSystemStatus: alerts.length > 0 ? "Attention Needed" : "Normal",
      },
      recentUploads: uploads.slice(0, 5),
      recentAlerts: alerts.slice(0, 5),
    };

    res.json(coordinatorDashboard);
  } catch (error) {
    console.error("Error building coordinator dashboard:", error);
    res.status(500).json({
      message: "Could not load coordinator dashboard data.",
    });
  }
};

module.exports = {
  getCoordinatorDashboard,
};