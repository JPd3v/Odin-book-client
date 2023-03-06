import { LoadingPage } from 'components/common';
import { SinglePost, useSinglePost } from 'features/posts/index';
import PageNotFound404 from 'pages/PageNotFound404';
import { Navigate, useParams } from 'react-router-dom';

export default function IndividualPost() {
  const params = useParams();

  const QUERY_KEY = `post, ${params.id}`;
  const post = useSinglePost(QUERY_KEY);

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
      {post.data ? <SinglePost post={post.data} queryKey={QUERY_KEY} /> : null}
    </main>
  );
}
