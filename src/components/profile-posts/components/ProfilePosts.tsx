import { useEffect, useRef } from 'react';
import type { IPost } from 'types/index';
import useUserPosts from '../hooks/useUserPosts';
import Post from './Post';

export default function ProfilePosts() {
  const posts = useUserPosts();
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
    <div className="profile-posts">
      <div className="posts-container">
        {posts
          ? posts.data?.pages?.map((page) => {
              return page.posts.map((userPost: IPost) => {
                return <Post key={userPost._id} userPost={userPost} />;
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
            Something went wrong when trying to get user posts, try again later
          </p>
        ) : null}

        {posts
          ? posts.data?.pages?.map((page) =>
              page.posts.length === 0 ? (
                <h2 className="profile-posts__empty-posts">
                  user has never posted anything
                </h2>
              ) : null
            )
          : null}
      </div>
    </div>
  );
}
