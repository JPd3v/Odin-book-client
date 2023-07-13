const replyKeys = {
  all: ['replies'] as const,
  replies: () => [...replyKeys.all, 'comment'] as const,
  reply: (commentId: string) => [...replyKeys.replies(), commentId] as const,
};

export default replyKeys;
