import { useEffect, useRef } from 'react';
import type { IPost } from 'types/index';
import useFeed from '../hooks/useFeed';
import UserPost from './UserPost';
import NewPostForm from './NewPostForm';

export default function UserFeed() {
  const posts = useFeed();
  const loadingDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio <= 0) return;

      if (posts.hasNextPage) {
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
    <div className="feed-container">
      <NewPostForm />
      <div className="posts-container">
        {posts
          ? posts.data?.pages.map((page) => {
              return page.posts.map((userPost: IPost) => {
                return <UserPost key={userPost._id} userPost={userPost} />;
              });
            })
          : null}

        {posts.hasNextPage ? (
          <div className="infite-scroll-post-loading" ref={loadingDivRef}>
            loading component place holder
          </div>
        ) : null}

        {posts.isError ? (
          <p>
            Something went wrong when trying to get your feed posts, try again
            later
          </p>
        ) : null}
      </div>
    </div>
  );
}
