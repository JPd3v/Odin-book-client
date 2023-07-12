import { IComment, InfiniteComments } from 'types';

function addNewCommentInCache(
  prev: InfiniteComments | undefined,
  newComment: IComment
) {
  if (!prev) return undefined;
  return {
    ...prev,
    pages: prev?.pages?.map((page, index) => {
      if (index === 0) {
        return {
          ...page,
          comments: [...page.comments, newComment],
        };
      }
      return page;
    }),
  };
}

function editCommentInCache(
  prev: InfiniteComments | undefined,
  editedComment: IComment
) {
  if (!prev) return undefined;
  return {
    ...prev,
    pages: prev?.pages?.map((page) => ({
      ...page,
      comments: page.comments.map((comment) =>
        comment._id === editedComment._id ? editedComment : comment
      ),
    })),
  };
}

function deleteCommentInCache(
  prev: InfiniteComments | undefined,
  deletedComment: IComment
) {
  if (!prev) return undefined;
  return {
    ...prev,
    pages: prev?.pages?.map((page) => ({
      ...page,
      comments: page.comments.filter(
        (comment) => comment._id !== deletedComment._id
      ),
    })),
  };
}

function updateLikeCommentInCache(
  prev: InfiniteComments | undefined,
  commentId: string
) {
  if (!prev) return undefined;
  return {
    ...prev,
    pages: prev?.pages.map((page) => ({
      ...page,
      comments: page.comments.map((comment) => {
        if (comment._id === commentId) {
          if (comment.isLikedByUser) {
            return {
              ...comment,
              isLikedByUser: false,
              likesCount: comment.likesCount - 1,
            };
          }

          return {
            ...comment,
            isLikedByUser: true,
            likesCount: comment.likesCount + 1,
          };
        }
        return comment;
      }),
    })),
  };
}

export {
  addNewCommentInCache,
  editCommentInCache,
  deleteCommentInCache,
  updateLikeCommentInCache,
};
