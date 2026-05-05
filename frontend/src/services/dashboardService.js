const API_BASE_URL = "http://localhost:5000/api";

export async function getPublicDashboardData() {
  const response = await fetch(`${API_BASE_URL}/dashboard`);

  if (!response.ok) {
    throw new Error("Failed to fetch public dashboard data");
  }

  return response.json();
}
export async function triggerPollutionSpike() {
  const response = await fetch(
    `${API_BASE_URL}/simulator/pollution-spike`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to trigger pollution spike");
  }

  return response.json();
}
export async function toggleSimulator(enabled) {
  const response = await fetch(
    `${API_BASE_URL}/simulator/toggle`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ enabled }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to toggle simulator");
  }

  return response.json();
}

export async function restoreNormalConditions() {
  const response = await fetch(
    `${API_BASE_URL}/simulator/restore-normal`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to restore conditions");
  }

  return response.json();
}