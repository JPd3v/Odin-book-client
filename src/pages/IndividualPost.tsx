import { SinglePost } from 'features/posts/index';
import { Navigate, useParams } from 'react-router-dom';

export default function IndividualPost() {
  const params = useParams();

  if (!params.id) {
    return <Navigate to="/" />;
  }

  return (
    <main className="post-page">
      <SinglePost />
    </main>
  );
}
