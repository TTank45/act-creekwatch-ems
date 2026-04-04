const API_BASE_URL = "http://localhost:5000/api";

export async function getPublicDashboardData() {
  const response = await fetch(`${API_BASE_URL}/dashboard`);

  if (!response.ok) {
    throw new Error("Failed to fetch public dashboard data");
  }

  return response.json();
}