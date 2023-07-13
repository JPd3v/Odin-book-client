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

export { newReplyOnCache };
