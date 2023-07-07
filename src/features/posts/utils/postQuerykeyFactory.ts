const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
  profiles: () => [...postKeys.all, 'profile'] as const,
  profile: (id: string) => [...postKeys.profiles(), id] as const,
};

export default postKeys;
