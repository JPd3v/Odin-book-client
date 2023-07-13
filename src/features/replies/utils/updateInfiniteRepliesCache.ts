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

function editReplyInCache(
  prev: InfiniteReplies | undefined,
  editedReply: IReply
) {
  if (!prev) return undefined;
  return {
    ...prev,
    pages: prev.pages.map((page) => ({
      ...page,
      replies: page.replies.map((reply) =>
        reply._id === editedReply._id ? editedReply : reply
      ),
    })),
  };
}

function likeReplyInCache(prev: InfiniteReplies | undefined, replyId: string) {
  if (!prev) return undefined;
  return {
    ...prev,
    pages: prev.pages.map((page) => ({
      ...page,
      replies: page.replies.map((reply) => {
        if (reply._id === replyId) {
          if (reply.isLikedByUser) {
            return {
              ...reply,
              isLikedByUser: false,
              likesCount: reply.likesCount - 1,
            };
          }
          return {
            ...reply,
            isLikedByUser: true,
            likesCount: reply.likesCount + 1,
          };
        }
        return reply;
      }),
    })),
  };
}

export {
  newReplyOnCache,
  deleteReplyInCache,
  editReplyInCache,
  likeReplyInCache,
};
