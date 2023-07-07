import { useEffect, useRef } from 'react';
import type { IPost } from 'types/index';
import { LoadingSpinner } from 'components/common';
import useFeed from 'features/posts/hooks/useFeed';
import Post from './Post';

export default function PostList() {
  const posts = useFeed();
  const loadingDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio <= 0) return;

      if (posts.hasNextPage && !posts.isFetchingNextPage) {
        posts.fetchNextPage();
        intersectionObserver.disconnect();
      }
    });

    if (loadingDivRef.current) {
      intersectionObserver.observe(loadingDivRef.current);
    }

    return () => {
      return intersectionObserver.disconnect();
    };
  }, [loadingDivRef, posts]);

  return (
    <div className="posts-container">
      {posts?.data?.pages.map((page) => {
        return page.posts.map((post: IPost) => {
          return <Post key={post._id} post={post} />;
        });
      })}

      {posts.isFetchingNextPage || posts.isLoading ? (
        <div className="infite-scroll-post-loading">
          <LoadingSpinner />
        </div>
      ) : null}

      {posts.hasNextPage ? <div ref={loadingDivRef} /> : null}

      {posts.isError ? (
        <p>
          Something went wrong when trying to get your feed posts, try again
          later
        </p>
      ) : null}
    </div>
  );
}
