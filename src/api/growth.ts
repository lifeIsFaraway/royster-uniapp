import type { IBadge, ICheckinRes, IGrowthInfo, ILevelUpRequirement } from './types/growth'
import { http } from '@/http/http'

/**
 * 获取我的成长信息（等级、灵感值、徽章、入圈天数等）
 */
export function getMyGrowthInfo() {
  return http.get<IGrowthInfo>('/growth/me')
}

/**
 * 获取当前升级要求（灵感值进度 + 里程碑任务）
 */
export function getLevelUpRequirement() {
  return http.get<ILevelUpRequirement>('/growth/milestones')
}

/**
 * 获取所有徽章（含未解锁的，用于徽章展示墙）
 */
export function getAllBadges() {
  return http.get<IBadge[]>('/growth/badges')
}

/**
 * 每日打卡
 */
export function dailyCheckin() {
  return http.post<ICheckinRes>('/growth/checkin')
}
