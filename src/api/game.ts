import { request } from './http';
import type {
  AchievementResponse,
  ChatReply,
  DailyMissionResponse,
  FlowerType,
  MissionValidationResponse,
  PlantItemResponse,
  RewardCatalogResponse,
  RewardResponse,
  SoulieResponse,
  WaterResponse,
} from './types';

export function getSoulie() {
  return request<SoulieResponse>('/v1/soulie');
}

export function updateSoulie(body: { name?: string; flowerType?: FlowerType }) {
  return request<SoulieResponse>('/v1/soulie', { method: 'PATCH', body });
}

export function waterSoulie() {
  return request<WaterResponse>('/v1/soulie/water', { method: 'POST' });
}

export function getPlants() {
  return request<PlantItemResponse[]>('/v1/soulie/plants');
}

export function unlockPlantCode(code: string) {
  return request<PlantItemResponse[]>('/v1/soulie/plants/unlock-code', {
    method: 'POST',
    body: { code },
  });
}

export function getMissions() {
  return request<DailyMissionResponse[]>('/v1/missions');
}

export function validateMission(id: number, photo: File) {
  const body = new FormData();
  body.append('photo', photo);
  return request<MissionValidationResponse>(`/v1/missions/${id}/validate`, {
    method: 'POST',
    body,
  });
}

export function getValidation(id: number) {
  return request<MissionValidationResponse>(`/v1/missions/validations/${id}`);
}

export function getAchievements() {
  return request<AchievementResponse[]>('/v1/achievements');
}

export function sendChat(message: string, context?: { mission?: { name?: string; desc?: string; xp?: number; tag?: string }; userLevel?: number }) {
  return request<ChatReply>('/v1/chat/soulie-ia', {
    method: 'POST',
    body: { message, context },
  });
}

export function getRewardCatalog() {
  return request<RewardCatalogResponse[]>('/reward/catalog');
}

export function getMyRewards() {
  return request<RewardResponse[]>('/reward');
}

export function redeemReward(rewardCatalogId: number) {
  return request<RewardResponse>('/reward', {
    method: 'POST',
    body: { rewardCatalogId },
  });
}
