import axios from 'axios';

import { env } from '../config/env.js';
import type { BffUserProfile, UpstreamPost, UpstreamUser } from '../types/user.js';

const http = axios.create({
  baseURL: env.UPSTREAM_BASE_URL,
  timeout: env.REQUEST_TIMEOUT_MS
});

type CacheEntry = {
  data: BffUserProfile;
  expiresAt: number;
};

const profileCache = new Map<number, CacheEntry>();

export async function getUserProfileById(userId: number): Promise<BffUserProfile | null> {
  const now = Date.now();
  const cached = profileCache.get(userId);
  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  const [userResp, postsResp] = await Promise.all([
    http.get<UpstreamUser>(`/users/${userId}`),
    http.get<UpstreamPost[]>('/posts', { params: { userId } })
  ]);

  const user = userResp.data;
  if (!user?.id) {
    return null;
  }

  const posts = postsResp.data ?? [];

  const result: BffUserProfile = {
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email
    },
    stats: {
      postCount: posts.length
    },
    recentPosts: posts.slice(0, 3).map((item) => ({
      id: item.id,
      title: item.title
    }))
  };

  profileCache.set(userId, {
    data: result,
    expiresAt: now + env.CACHE_TTL_MS
  });

  return result;
}
