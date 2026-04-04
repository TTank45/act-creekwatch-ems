import { useEffect, useState } from "react";
import { getUploads } from "../services/uploadService";
import SectionCard from "../components/common/SectionCard";
import RecentUploads from "../components/volunteer/RecentUploads";
import UploadDropzone from "../components/volunteer/UploadDropzone";

function UploadCsvPage() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchUploadsData() {
    try {
      const data = await getUploads();
      setUploads(data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Could not load upload history.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUploadsData();
  }, []);

  return (
    <section className="page">
      <div className="container">
        <div className="page-heading">
          <h1>Upload CSV</h1>
          <p>
            Upload creek monitoring CSV files, view validation progress, and check
            recent submission history.
          </p>
        </div>

        <div className="upload-layout">
          <SectionCard title="Upload Area">

  {/* 🔽 NEW: Download Sample CSV Button */}
  <div style={{ marginBottom: "1rem" }}>
    <a
      href="/sample_creek_data_valid.csv"
      download
      style={{
        display: "inline-block",
        padding: "10px 16px",
        backgroundColor: "#0d6efd",
        color: "#fff",
        borderRadius: "6px",
        textDecoration: "none",
        fontWeight: "500"
      }}
    >
      Download Sample CSV Template
    </a>
  </div>

  <UploadDropzone onUploadSuccess={fetchUploadsData} />

</SectionCard>

          <SectionCard title="Recent Upload History">
            {loading && <p>Loading uploads...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && <RecentUploads uploads={uploads} />}
          </SectionCard>
        </div>
      </div>
    </section>
  );
}

export default UploadCsvPage;