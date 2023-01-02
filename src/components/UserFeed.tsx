import { useEffect, useRef } from 'react';
import useUserRelatedPosts from '../hooks/useUserRelatedPosts';
import UserPost from './UserPost';
import type { IUserPost } from './UserPost';

export default function UserFeed() {
  const posts = useUserRelatedPosts();
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
    <>
      {posts
        ? posts.data?.pages.map((page) => {
            return page.map((userPost: IUserPost) => {
              return <UserPost key={userPost._id} userPost={userPost} />;
            });
          })
        : null}

      <div className="infite-scroll-post-loading" ref={loadingDivRef}>
        loading component place holder
      </div>
    </>
  );
}
