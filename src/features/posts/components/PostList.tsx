import { useEffect, useRef } from 'react';
import type { IPost } from 'types/index';
import { LoadingSpinner } from 'components/common';
import { UseInfiniteQueryResult } from '@tanstack/react-query';
import { IPage } from '../types';
import Post from './Post';

interface IProps {
  queryKey: string | Array<string | number>;
  postsQuery: () => UseInfiniteQueryResult<IPage, unknown>;
}

export default function PostList({ queryKey, postsQuery }: IProps) {
  const posts = postsQuery();
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
    <div className="posts-container">
      {posts
        ? posts.data?.pages.map((page) => {
            return page.posts.map((userPost: IPost) => {
              return (
                <Post key={userPost._id} post={userPost} queryKey={queryKey} />
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
          Something went wrong when trying to get your feed posts, try again
          later
        </p>
      ) : null}
    </div>
  );
}
