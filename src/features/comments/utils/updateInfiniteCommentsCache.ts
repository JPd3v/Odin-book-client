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

export { addNewCommentInCache, editCommentInCache };
