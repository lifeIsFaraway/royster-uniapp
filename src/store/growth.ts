import type { IBadge, IGrowthInfo, ILevelUpRequirement, UserLevel } from '@/api/types/growth'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { dailyCheckin, getAllBadges, getMyGrowthInfo } from '@/api/growth'

/** 各等级升级所需灵感值（本地常量，用于进度条计算） */
export const LEVEL_POINTS_REQUIRED: Record<UserLevel, number> = {
  0: 0,
  1: 200,
  2: 600,
  3: 1500,
}

/** 各等级称号和图标 */
export const LEVEL_CONFIG: Record<UserLevel, { title: string; icon: string; unlockedSongs: number }> = {
  0: { title: '初听者', icon: '🌱', unlockedSongs: 6 },
  1: { title: '入迷者', icon: '🎵', unlockedSongs: 16 },
  2: { title: '沉迷者', icon: '🌙', unlockedSongs: 30 },
  3: { title: '铁杆粉', icon: '🔥', unlockedSongs: 999 },
}

export const useGrowthStore = defineStore('growth', () => {
  // 当前等级
  const level = ref<UserLevel>(0)
  // 当前灵感值
  const inspirePoints = ref(0)
  // 升级要求
  const levelUpRequirement = ref<ILevelUpRequirement | null>(null)
  // 所有徽章
  const badges = ref<IBadge[]>([])
  // 入圈天数
  const joinDays = ref(0)
  // 今日是否已打卡
  const hasCheckedInToday = ref(false)
  // 精神属性标签
  const spiritualTags = ref<string[]>([])
  // 第一首听的歌 ID
  const firstSongId = ref<number | undefined>(undefined)

  /** 升级进度百分比（0-100） */
  const levelProgress = computed(() => {
    if (level.value === 3) return 100
    const required = LEVEL_POINTS_REQUIRED[((level.value + 1) as UserLevel)]
    const current = LEVEL_POINTS_REQUIRED[level.value]
    return Math.min(100, Math.round(((inspirePoints.value - current) / (required - current)) * 100))
  })

  /** 当前等级配置信息 */
  const currentLevelConfig = computed(() => LEVEL_CONFIG[level.value])

  /**
   * 拉取成长信息
   */
  const fetchGrowthInfo = async () => {
    const res: IGrowthInfo = await getMyGrowthInfo()
    level.value = res.level
    inspirePoints.value = res.inspirePoints
    levelUpRequirement.value = res.levelUpRequirement || null
    badges.value = res.badges
    joinDays.value = res.joinDays
    hasCheckedInToday.value = res.hasCheckedInToday
    spiritualTags.value = res.spiritualTags
    firstSongId.value = res.firstSongId
  }

  /**
   * 拉取所有徽章（用于徽章展示墙）
   */
  const fetchAllBadges = async () => {
    const res = await getAllBadges()
    badges.value = res
  }

  /**
   * 每日打卡
   */
  const checkin = async () => {
    if (hasCheckedInToday.value) return null
    const res = await dailyCheckin()
    if (res.success) {
      inspirePoints.value = res.totalPoints
      hasCheckedInToday.value = true
    }
    return res
  }

  /**
   * 增加灵感值（前端乐观更新，触发动效用）
   */
  const addInspirePoints = (points: number) => {
    inspirePoints.value += points
  }

  return {
    level,
    inspirePoints,
    levelUpRequirement,
    badges,
    joinDays,
    hasCheckedInToday,
    spiritualTags,
    firstSongId,
    levelProgress,
    currentLevelConfig,
    fetchGrowthInfo,
    fetchAllBadges,
    checkin,
    addInspirePoints,
  }
})
