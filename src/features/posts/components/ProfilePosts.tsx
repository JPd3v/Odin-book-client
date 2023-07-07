import { LoadingSpinner } from 'components/common';
import { useEffect, useRef } from 'react';
import { useUserProfile } from 'features/users';
import useProfilePosts from '../hooks/useProfilePosts';
import Post from './Post';

export default function ProfilePosts() {
  const posts = useProfilePosts();
  const { data } = useUserProfile();
  const userFullName = `${data?.first_name} ${data?.last_name}`;

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
      {posts?.data?.pages?.map((page) => {
        return page.posts.map((userPost) => {
          return <Post key={userPost._id} post={userPost} />;
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
          Something went wrong when trying to get user posts, try again later
        </p>
      ) : null}

      {posts?.data?.pages[0].posts.length === 0 ? (
        <h2 className="profile-posts__empty-posts">
          {userFullName ?? 'user'} has never published anything
        </h2>
      ) : null}
    </div>
  );
}
