import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="page">
      <div className="container not-found-page">
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;