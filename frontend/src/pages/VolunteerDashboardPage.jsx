import { useEffect, useState } from "react";
import { getVolunteerDashboardData } from "../services/volunteerService";
import SectionCard from "../components/common/SectionCard";
import ContributionStats from "../components/volunteer/ContributionStats";
import BadgeList from "../components/volunteer/BadgeList";
import RecentUploads from "../components/volunteer/RecentUploads";

function VolunteerDashboardPage() {
  const [volunteerData, setVolunteerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchVolunteerData() {
      try {
        const data = await getVolunteerDashboardData();
        setVolunteerData(data);
      } catch (error) {
        console.error(error);
        setError("Could not load volunteer dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    fetchVolunteerData();
  }, []);

  if (loading) {
    return (
      <section className="page">
        <div className="container">
          <h1>Volunteer Dashboard</h1>
          <p>Loading volunteer data...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <div className="container">
          <h1>Volunteer Dashboard</h1>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="container">
        <div className="page-heading">
          <h1>Volunteer Dashboard</h1>
          <p>
            Personal contribution summary, badges earned, and recent environmental
            data submissions.
          </p>
        </div>

        <div className="dashboard-grid">
          <SectionCard title={`Welcome, ${volunteerData.name}`}>
            <p>{volunteerData.welcomeMessage}</p>
          </SectionCard>

          <SectionCard title="Your Contributions">
            <ContributionStats contributions={volunteerData.contributions} />
          </SectionCard>

          <SectionCard title="Impact Badges">
            <BadgeList badges={volunteerData.badges} />
          </SectionCard>

          <SectionCard title="Recent Uploads">
            <RecentUploads uploads={volunteerData.recentUploads} />
          </SectionCard>
        </div>
      </div>
    </section>
  );
}

export default VolunteerDashboardPage;