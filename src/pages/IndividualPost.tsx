import { LoadingPage } from 'components/common';
import { Post, usePost } from 'components/single-post/index';
import PageNotFound404 from 'pages/PageNotFound404';
import { Navigate, useParams } from 'react-router-dom';

export default function IndividualPost() {
  const params = useParams();
  const post = usePost();

  if (!params.id) {
    return <Navigate to="/" />;
  }

  if (post.isLoading) {
    return <LoadingPage />;
  }

  if (post.error || post.failureCount) {
    return <PageNotFound404 />;
  }

  return (
    <main className="post-page">
      {post.data ? <Post post={post.data} /> : null}
    </main>
  );
}
