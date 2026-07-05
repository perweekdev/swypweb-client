export const queryKeys = {
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
  },
  posts: {
    all: ['posts'] as const,
    list: (page: number) => [...queryKeys.posts.all, 'list', page] as const,
    detail: (id: string) => [...queryKeys.posts.all, 'detail', id] as const,
  },
};
