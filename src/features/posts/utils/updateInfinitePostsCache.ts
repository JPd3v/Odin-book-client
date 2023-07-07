import { InfiniteData } from 'features/posts/types';

// eslint-disable-next-line import/prefer-default-export
export function updateInfinitePostsLikesCache(
  prev: InfiniteData | undefined,
  postId: string
) {
  if (!prev) return undefined;
  return {
    ...prev,
    pages: prev?.pages?.map((page) => ({
      ...page,
      posts: page.posts.map((post) => {
        if (post._id === postId) {
          if (post.isLikedByUser) {
            return {
              ...post,
              isLikedByUser: false,
              likesCount: post.likesCount - 1,
            };
          }
          return {
            ...post,
            isLikedByUser: true,
            likesCount: post.likesCount + 1,
          };
        }
        return post;
      }),
    })),
  };
}
