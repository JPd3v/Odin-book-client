import { InfiniteData } from 'features/posts/types';
import { IPost } from 'types';

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

export function addNewPostToCache(
  prev: InfiniteData | undefined,
  newPost: IPost
) {
  if (!prev || !prev.pages) return undefined;
  return {
    ...prev,
    pages: prev.pages.map((page, index) => {
      if (index === 0) {
        return { ...page, posts: [newPost, ...page.posts] };
      }
      return page;
    }),
  };
}

export function deletePostFromCache(
  prev: InfiniteData | undefined,
  post: IPost
) {
  if (!prev) return undefined;
  const postId = post._id;

  return {
    ...prev,
    pages: prev?.pages?.map((page) => ({
      ...page,
      posts: page.posts.filter((p) => p._id !== postId),
    })),
  };
}

export function editPostFromCache(
  prev: InfiniteData | undefined,
  editedPost: IPost
) {
  return {
    ...prev,
    pages: prev?.pages?.map((page) => ({
      ...page,
      posts: page.posts.map((post) =>
        post._id === editedPost._id ? editedPost : post
      ),
    })),
  };
}
