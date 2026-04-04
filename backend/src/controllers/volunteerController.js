const fs = require("fs");
const path = require("path");

const volunteerDashboardFilePath = path.join(
  __dirname,
  "../data/volunteerDashboard.json"
);
const uploadsFilePath = path.join(__dirname, "../data/uploads.json");
const alertsFilePath = path.join(__dirname, "../data/alerts.json");
const latestReadingsFilePath = path.join(
  __dirname,
  "../data/latestReadings.json"
);

function readJsonFile(filePath, fallback) {
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

const getVolunteerDashboard = (req, res) => {
  try {
    const baseVolunteerData = readJsonFile(volunteerDashboardFilePath, {
      name: "Volunteer",
      welcomeMessage: "Thank you for supporting ACT CreekWatch monitoring.",
      badges: [],
    });

    const uploads = readJsonFile(uploadsFilePath, []);
    const alerts = readJsonFile(alertsFilePath, []);
    const latestReadings = readJsonFile(latestReadingsFilePath, []);

    const totalUploads = uploads.length;
    const sitesVisited = countUniqueSites(latestReadings);
    const alertsSubmitted = alerts.length;

    const volunteerDashboard = {
      name: baseVolunteerData.name || "Volunteer",
      welcomeMessage:
        baseVolunteerData.welcomeMessage ||
        "Thank you for supporting ACT CreekWatch monitoring.",
      contributions: {
        totalUploads,
        sitesVisited,
        alertsSubmitted,
        dataQualityScore: 94,
      },
      badges: baseVolunteerData.badges || [],
      recentUploads: uploads.slice(0, 5),
    };

    res.json(volunteerDashboard);
  } catch (error) {
    console.error("Error building volunteer dashboard:", error);
    res.status(500).json({
      message: "Could not load volunteer dashboard data.",
    });
  }
};

module.exports = {
  getVolunteerDashboard,
};