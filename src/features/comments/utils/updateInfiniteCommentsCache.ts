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

export { addNewCommentInCache };
