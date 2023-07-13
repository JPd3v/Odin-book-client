import { IReply, InfiniteReplies } from 'types';

function newReplyOnCache(prev: InfiniteReplies | undefined, newReply: IReply) {
  if (!prev) return undefined;
  return {
    ...prev,
    pages: prev.pages.map((page, index) => {
      if (index === 0) {
        return { ...page, replies: [...page.replies, newReply] };
      }
      return page;
    }),
  };
}

function deleteReplyInCache(
  prev: InfiniteReplies | undefined,
  deletedReplyId: string
) {
  if (!prev) return undefined;
  return {
    ...prev,
    pages: prev?.pages.map((page) => ({
      ...page,
      replies: page.replies.filter((reply) => reply._id !== deletedReplyId),
    })),
  };
}

export { newReplyOnCache, deleteReplyInCache };
