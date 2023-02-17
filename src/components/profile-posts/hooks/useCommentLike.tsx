import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from 'hooks/index';
import { axiosConfig } from 'config/index';
import type { IComment } from 'types/index';
import { useParams } from 'react-router-dom';
import type { InfiniteData, InfiniteDatacontext } from '../types';

async function likeComment(comment: IComment, userToken: string) {
  const req = await axiosConfig.post(
    `/comments/${comment._id}/like`,
    {},
    { headers: { authorization: `Bearer ${userToken}` } }
  );
  return req.data;
}

export default function useCommentLike() {
  const { userToken, userInfo } = useAuth();
  const queryClient = useQueryClient();

  const params = useParams();
  const profileUserId = params.id ?? '';

  return useMutation<string[], unknown, IComment, InfiniteDatacontext>(
    ['user posts', profileUserId],
    {
      mutationFn: (comment) => likeComment(comment, userToken ?? ''),
      onMutate: async (currentComment) => {
        const userId = userInfo?._id ?? '';
        const postId = currentComment.post_id;
        const commentId = currentComment._id;

        await queryClient.cancelQueries(['user posts', profileUserId]);

        const previousPosts = queryClient.getQueryData<InfiniteData>([
          'user posts',
          profileUserId,
        ]);

        queryClient.setQueryData<InfiniteData>(
          ['user posts', profileUserId],
          (prev) => {
            return {
              ...prev,
              pages: prev?.pages?.map((page) => ({
                ...page,
                posts: page.posts.map((post) => {
                  if (post._id === postId)
                    return {
                      ...post,
                      comments: post.comments.map((comment) => {
                        if (comment._id === commentId) {
                          if (comment.likes.includes(userId)) {
                            const filteredLikes = comment.likes.filter(
                              (id) => id !== userId
                            );
                            return { ...comment, likes: filteredLikes };
                          }
                          return {
                            ...comment,
                            likes: [...comment.likes, userId],
                          };
                        }
                        return comment;
                      }),
                    };
                  return post;
                }),
              })),
            };
          }
        );
        return { previousPosts };
      },
      onError(_error, _variables, context) {
        queryClient.setQueryData(
          ['user posts', profileUserId],
          context?.previousPosts
        );
      },
      onSuccess(data, currentComment) {
        const postId = currentComment.post_id;
        const commentId = currentComment._id;

        queryClient.setQueryData<InfiniteData>(
          ['user posts', profileUserId],
          (prev) => {
            return {
              ...prev,
              pages: prev?.pages?.map((page) => ({
                ...page,
                posts: page.posts.map((post) => {
                  if (post._id === postId)
                    return {
                      ...post,
                      comments: post.comments.map((comment) => {
                        return comment._id === commentId
                          ? { ...comment, likes: [...data] }
                          : comment;
                      }),
                    };
                  return post;
                }),
              })),
            };
          }
        );
      },
    }
  );
}
