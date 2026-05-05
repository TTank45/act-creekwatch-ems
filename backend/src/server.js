const express = require("express");
const cors = require("cors");

const dashboardRoutes = require("./routes/dashboardRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const coordinatorRoutes = require("./routes/coordinatorRoutes");
const alertRoutes = require("./routes/alertRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const { startIotSimulator } = require("./services/iotSimulator");
const simulatorRoutes = require("./routes/simulatorRoutes");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("ACT CreekWatch EMS backend is running");
});

// API routes
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use("/api/coordinator", coordinatorRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/simulator", simulatorRoutes);

startIotSimulator();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
