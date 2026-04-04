import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function getParameterStatus(parameter, value) {
  const numericValue = Number(value);

  if (parameter === "ph") {
    if (numericValue < 6.5 || numericValue > 8.5) {
      return { label: "Critical", color: "#dc3545" };
    }
    if (numericValue < 6.8 || numericValue > 8.2) {
      return { label: "Warning", color: "#fd7e14" };
    }
    return { label: "Normal", color: "#198754" };
  }

  if (parameter === "turbidity") {
    if (numericValue > 8) {
      return { label: "Critical", color: "#dc3545" };
    }
    if (numericValue > 5) {
      return { label: "Warning", color: "#fd7e14" };
    }
    return { label: "Normal", color: "#198754" };
  }

  if (parameter === "oxygen") {
    if (numericValue < 6) {
      return { label: "Critical", color: "#dc3545" };
    }
    if (numericValue < 7) {
      return { label: "Warning", color: "#fd7e14" };
    }
    return { label: "Normal", color: "#198754" };
  }

  return { label: "Unknown", color: "#6c757d" };
}

function TrendChart({ data }) {
  const latestReading = data && data.length > 0 ? data[data.length - 1] : null;

  const phStatus = latestReading
    ? getParameterStatus("ph", latestReading.ph)
    : null;

  const turbidityStatus = latestReading
    ? getParameterStatus("turbidity", latestReading.turbidity)
    : null;

  const oxygenStatus = latestReading
    ? getParameterStatus("oxygen", latestReading.oxygen)
    : null;

  return (
    <div className="chart-wrapper">
      <p style={{ marginBottom: "1rem", color: "#555" }}>
        This chart shows recent daily average readings based on uploaded monitoring data.
      </p>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            label={{ value: "Sampling Date", position: "insideBottom", offset: -5 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line type="monotone" dataKey="ph" name="pH" strokeWidth={2} />
          <Line type="monotone" dataKey="turbidity" name="Turbidity (NTU)" strokeWidth={2} />
          <Line type="monotone" dataKey="oxygen" name="Dissolved Oxygen (mg/L)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>

      {latestReading && (
        <div
          style={{
            marginTop: "1.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          <div
            style={{
              padding: "1rem",
              borderRadius: "8px",
              backgroundColor: "#f8f9fa",
              borderLeft: `5px solid ${phStatus.color}`,
            }}
          >
            <h4 style={{ marginBottom: "0.5rem" }}>Latest pH</h4>
            <p style={{ margin: "0 0 0.4rem 0" }}>
              <strong>Value:</strong> {latestReading.ph}
            </p>
            <p style={{ margin: 0, color: phStatus.color, fontWeight: "600" }}>
              {phStatus.label}
            </p>
          </div>

          <div
            style={{
              padding: "1rem",
              borderRadius: "8px",
              backgroundColor: "#f8f9fa",
              borderLeft: `5px solid ${turbidityStatus.color}`,
            }}
          >
            <h4 style={{ marginBottom: "0.5rem" }}>Latest Turbidity</h4>
            <p style={{ margin: "0 0 0.4rem 0" }}>
              <strong>Value:</strong> {latestReading.turbidity} NTU
            </p>
            <p style={{ margin: 0, color: turbidityStatus.color, fontWeight: "600" }}>
              {turbidityStatus.label}
            </p>
          </div>

          <div
            style={{
              padding: "1rem",
              borderRadius: "8px",
              backgroundColor: "#f8f9fa",
              borderLeft: `5px solid ${oxygenStatus.color}`,
            }}
          >
            <h4 style={{ marginBottom: "0.5rem" }}>Latest Dissolved Oxygen</h4>
            <p style={{ margin: "0 0 0.4rem 0" }}>
              <strong>Value:</strong> {latestReading.oxygen} mg/L
            </p>
            <p style={{ margin: 0, color: oxygenStatus.color, fontWeight: "600" }}>
              {oxygenStatus.label}
            </p>
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <h4 style={{ marginBottom: "0.5rem" }}>Parameter Guide</h4>

        <ul style={{ margin: 0, paddingLeft: "1.2rem", lineHeight: "1.6" }}>
          <li>
            <strong>pH:</strong> Acidity level (no unit). Normal range: 6.5–8.5
          </li>
          <li>
            <strong>Turbidity:</strong> Water clarity (NTU). Clean water: 0–5 NTU
          </li>
          <li>
            <strong>Dissolved Oxygen:</strong> Oxygen level (mg/L). Healthy: 6–10 mg/L
          </li>
        </ul>
      </div>
    </div>
  );
}

export default TrendChart;