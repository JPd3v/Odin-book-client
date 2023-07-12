const commentKeys = {
  all: ['comments'] as const,
  posts: () => [...commentKeys.all, 'post'] as const,
  post: (postId: string) => [...commentKeys.posts(), postId] as const,
};

export default commentKeys;
