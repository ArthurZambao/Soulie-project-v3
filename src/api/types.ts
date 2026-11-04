export type ValidationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'FAILED';
export type MissionPeriod = 'daily' | 'weekly' | 'monthly' | 'annual';
export type SoulieMood = 'happy' | 'sad' | 'wilted' | 'excited';
export type FlowerType =
  | 'girassol'
  | 'rosa'
  | 'hibisco'
  | 'lavanda'
  | 'margarida'
  | 'orquidea'
  | 'ipe_amarelo'
  | 'guaimbe_ondulado'
  | 'manaca_da_serra'
  | 'maranta'
  | 'pacova'
  | 'pitangueira'
  | 'rainha_do_abismo'
  | 'trevo_roxo'
  | 'mulungu'
  | 'sucupira_preta'
  | 'arvore_tecnologica';

export interface UserStatsResponse {
  streakDays: number;
  totalXp: number;
  globalRank: number;
  friendsRank: number;
  xpToNextRank: number;
  unlockedAchievementsCount: number;
  co2SavedKg: number;
  waterSavedLiters: number;
  plantsUnlocked: number;
  plantsTotal: number;
}

export interface UserSettingsResponse {
  notificationsEnabled: boolean;
  emailWeeklyDigest: boolean;
  allowNudges: boolean;
  showFullName: boolean;
}

export interface UserProfileResponse {
  id: number;
  name: string;
  handle: string;
  email: string;
  avatarUrl: string | null;
  memberSince: string;
  stats: UserStatsResponse;
  settings: UserSettingsResponse;
}

export type AuthSession = UserProfileResponse & { token: string };

export interface TokenDataJWT {
  tokenJWT: string;
}

export interface UserResponse {
  id: number;
  name: string;
  points: number;
  active: boolean;
}

export interface SoulieResponse {
  id: number;
  userId: number;
  name: string;
  flowerType: FlowerType;
  level: number;
  levelName: string;
  xp: number;
  nextLevelXp: number;
  wateredToday: boolean;
  lastWateredAt: string | null;
}

export interface WaterResponse {
  watered: boolean;
  message: string;
  streakDays: number;
}

export interface PlantItemResponse {
  id: string;
  name: string;
  starterEligible: boolean;
  unlocked: boolean;
  selected: boolean;
  xp: number;
  level: number;
  levelName: string;
  unlockSource: string;
  unlockHint: string;
}

export interface DailyMissionResponse {
  id: number;
  emoji: string;
  name: string;
  tag: string;
  desc: string;
  xp: number;
  done: boolean;
  completedAt: string | null;
  period: MissionPeriod | string;
}

export interface BadgeUnlockedResponse {
  id: number;
  name: string;
  desc: string;
  icon: string;
}

export interface SuggestedMissionResponse {
  id: number;
  name: string;
  tag: string;
  xp: number;
}

export interface MissionValidationResponse {
  success: boolean;
  xpGained: number;
  missionId: number;
  aiDetections: string[];
  co2SavedKg: number;
  badgeUnlocked: BadgeUnlockedResponse | null;
  nextSuggestedMission: SuggestedMissionResponse | null;
  validationId: number;
  status: ValidationStatus;
  reason: string | null;
}

export interface RankingItemResponse {
  pos: number;
  userId: number;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  isYou: boolean;
  level: number;
  flowerType: string;
}

export interface FeedPostResponse {
  id: number;
  author: string;
  avatarLetter: string;
  avatarColor: string;
  text: string;
  time: string;
  likes: number;
  comments: number;
  liked: boolean;
  imageUri: string | null;
  missionName: string | null;
  xp: number | null;
  mine: boolean;
}

export interface FeedCommentResponse {
  id: number;
  author: string;
  avatarLetter: string;
  text: string;
  time: string;
}

export interface LikeResponse {
  liked: boolean;
  likes: number;
}

export interface CommunityGardenResponse {
  id: number;
  name: string;
  inviteCode: string;
  members: number;
}

export interface GardenImpactResponse {
  co2Kg: number;
  recycledKg: number;
  transitCo2Kg: number;
  waterLiters: number;
  actions: number;
}

export interface NudgeResponse {
  remaining: number;
}

export interface NotificationResponse {
  id: number;
  title: string;
  body: string;
  createdAt: string;
}

export interface SocialUserResponse {
  id: number;
  name: string;
  handle: string;
  points: number;
  friend: boolean;
}

export interface FollowResponse {
  following: boolean;
  friendsNow: boolean;
  user: SocialUserResponse;
}

export interface AchievementResponse {
  id: number;
  name: string;
  desc: string;
  icon: string;
  color: string;
  category: string;
  unlocked: boolean;
  date: string;
  xp: number;
  progress: string;
}

export interface ActivityResponse {
  id: number;
  emoji: string;
  label: string;
  xp: number;
  date: string;
  timestamp: string;
}

export interface ChatReply {
  reply: string;
}

export interface RewardCatalogResponse {
  id: number;
  benefits: string;
  cost: number;
}

export interface RewardResponse {
  id: number;
  benefits: string;
  pointsSpent: number;
  remainingPoints: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface FieldError {
  field: string;
  message: string;
}

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string; status?: number };

export interface UserDataExport {
  profile: UserProfileResponse;
  activities: ActivityResponse[];
  achievements: AchievementResponse[];
}
