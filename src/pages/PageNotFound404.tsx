import { Link } from 'react-router-dom';

export default function PageNotFound404() {
  return (
    <main className="page-not-found">
      <div className="page-not-found__warning">
        <h2>This page is not available</h2>
        <p>
          <Link to="/">Back to Home</Link>
        </p>
      </div>
    </main>
  );
}
