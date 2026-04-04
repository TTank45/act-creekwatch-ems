const API_BASE_URL = "http://localhost:5000/api";

export async function getVolunteerDashboardData() {
  const response = await fetch(`${API_BASE_URL}/volunteer`);

  if (!response.ok) {
    throw new Error("Failed to fetch volunteer dashboard data");
  }

  return response.json();
}