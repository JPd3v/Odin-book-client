import { LoadingSpinner } from 'components/common';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import type { IPost } from 'types/index';
import useProfilePosts from '../hooks/useProfilePosts';
import PostsList from './Post';

export default function ProfilePosts() {
  const params = useParams();
  const userId = params.id as string;
  const QUERY_KEY = ['user posts', userId];
  const posts = useProfilePosts(QUERY_KEY, userId);
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
                return (
                  <PostsList
                    key={userPost._id}
                    userPost={userPost}
                    queryKey={QUERY_KEY}
                  />
                );
              });
            })
          : null}

        {posts.hasNextPage ? (
          <div className="infite-scroll-post-loading" ref={loadingDivRef}>
            <LoadingSpinner />
          </div>
        ) : null}

        {posts.isError ? (
          <p>
            Something went wrong when trying to get user posts, try again later
          </p>
        ) : null}

        {posts?.data?.pages[0].posts.length === 0 ? (
          <h2 className="profile-posts__empty-posts">
            user has never posted anything
          </h2>
        ) : null}
      </div>
    </div>
  );
}
