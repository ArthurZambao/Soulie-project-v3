import { request } from './http';
import type {
  CommunityGardenResponse,
  FeedCommentResponse,
  FeedPostResponse,
  FollowResponse,
  GardenImpactResponse,
  LikeResponse,
  NotificationResponse,
  NudgeResponse,
  PageResponse,
  RankingItemResponse,
  SocialUserResponse,
} from './types';

export function getRanking() {
  return request<RankingItemResponse[]>('/v1/community/ranking');
}

export function getFeed() {
  return request<FeedPostResponse[]>('/v1/community/feed');
}

export function createFeedPost(body: { text?: string; imageUri?: string; missionName?: string; xp?: number }) {
  return request<FeedPostResponse>('/v1/community/feed', { method: 'POST', body });
}

export function likeFeedPost(id: number) {
  return request<LikeResponse>(`/v1/community/feed/${id}/like`, { method: 'POST' });
}

export function getComments(id: number) {
  return request<FeedCommentResponse[]>(`/v1/community/feed/${id}/comments`);
}

export function addComment(id: number, text: string) {
  return request<FeedCommentResponse>(`/v1/community/feed/${id}/comments`, {
    method: 'POST',
    body: { text },
  });
}

export function deleteFeedPost(id: number) {
  return request<void>(`/v1/community/feed/${id}`, { method: 'DELETE' });
}

export function getGarden() {
  return request<CommunityGardenResponse | undefined>('/v1/community/garden');
}

export function createGarden() {
  return request<CommunityGardenResponse>('/v1/community/garden', { method: 'POST' });
}

export function joinGarden(code: string) {
  return request<CommunityGardenResponse>('/v1/community/garden/join', {
    method: 'POST',
    body: { code },
  });
}

export function leaveGarden() {
  return request<void>('/v1/community/garden', { method: 'DELETE' });
}

export function getGardenImpact() {
  return request<GardenImpactResponse>('/v1/community/garden/impact');
}

export function sendNudge(userId: number) {
  return request<NudgeResponse>('/v1/community/nudges', {
    method: 'POST',
    body: { userId },
  });
}

export function getNotifications() {
  return request<NotificationResponse[]>('/v1/community/notifications');
}

export function markNotificationsRead(ids: number[]) {
  return request<void>('/v1/community/notifications/read', {
    method: 'POST',
    body: { ids },
  });
}

export function followUser(userId: number) {
  return request<FollowResponse>(`/v1/social/follow/${userId}`, { method: 'POST' });
}

export function unfollowUser(userId: number) {
  return request<FollowResponse>(`/v1/social/follow/${userId}`, { method: 'DELETE' });
}

export function getFollowers() {
  return request<PageResponse<SocialUserResponse>>('/v1/social/followers?size=20');
}

export function getFollowing() {
  return request<PageResponse<SocialUserResponse>>('/v1/social/following?size=20');
}

export function getFriends() {
  return request<PageResponse<SocialUserResponse>>('/v1/social/friends?size=20');
}

export function findUserByHandle(handle: string) {
  const value = handle.startsWith('@') ? handle : `@${handle}`;
  return request<SocialUserResponse>(`/v1/social/users?handle=${encodeURIComponent(value)}`);
}
