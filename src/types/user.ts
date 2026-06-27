export type UpstreamUser = {
  id: number;
  name: string;
  username: string;
  email: string;
};

export type UpstreamPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type BffUserProfile = {
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
  };
  stats: {
    postCount: number;
  };
  recentPosts: Array<{
    id: number;
    title: string;
  }>;
};
