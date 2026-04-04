const API_BASE_URL = "http://localhost:5000/api";

export async function getUploads() {
  const response = await fetch(`${API_BASE_URL}/uploads`);

  if (!response.ok) {
    throw new Error("Failed to fetch uploads");
  }

  return response.json();
}

export async function uploadCsv(file) {
  const formData = new FormData();
  formData.append("csvFile", file);

  const response = await fetch(`${API_BASE_URL}/uploads`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Upload failed");
    error.details = data;
    throw error;
  }

  return data;
}