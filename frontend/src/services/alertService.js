const API_BASE_URL = "http://localhost:5000/api";

export async function getAlerts() {
  const response = await fetch(`${API_BASE_URL}/alerts`);

  if (!response.ok) {
    throw new Error("Failed to fetch alerts");
  }

  return response.json();
}

export async function getAlertById(id) {
  const response = await fetch(`${API_BASE_URL}/alerts/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch alert details");
  }

  return response.json();
}