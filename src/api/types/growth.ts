/**
 * 用户等级
 * 0: 初听者 | 1: 入迷者 | 2: 沉迷者 | 3: 铁杆粉
 */
export type UserLevel = 0 | 1 | 2 | 3

/**
 * 等级配置信息
 */
export interface ILevelConfig {
  level: UserLevel
  title: string // '初听者' | '入迷者' | '沉迷者' | '铁杆粉'
  icon: string // emoji
  unlockedSongs: number // 该等级累计可听歌曲数量
  pointsRequired: number // 升到该等级所需灵感值（0级默认0）
}

/**
 * 里程碑任务
 */
export interface IMilestone {
  id: string
  desc: string // 任务描述
  isCompleted: boolean
  completedAt?: string
}

/**
 * 当前等级的升级要求（灵感值 + 里程碑任务）
 */
export interface ILevelUpRequirement {
  currentLevel: UserLevel
  nextLevel: UserLevel
  pointsRequired: number // 升级所需总灵感值
  currentPoints: number // 当前灵感值
  milestones: IMilestone[] // 里程碑任务列表
  milestoneRequiredCount: number // 需要完成多少个里程碑（如"4选3"）
  milestoneCompletedCount: number // 当前已完成多少个
}

/**
 * 成就徽章
 */
export interface IBadge {
  id: string
  name: string // '深夜灵魂'
  icon: string // emoji 或图片URL
  desc: string // 获得条件描述
  unlockedAt?: string // 解锁时间，不存在表示尚未解锁
}

/**
 * 用户成长信息（综合）
 */
export interface IGrowthInfo {
  level: UserLevel
  inspirePoints: number // 当前灵感值
  levelUpRequirement?: ILevelUpRequirement // 升级要求（Lv3 时为 undefined）
  badges: IBadge[]
  joinDays: number // 入圈天数
  hasCheckedInToday: boolean // 今日是否已打卡
  spiritualTags: string[] // 精神属性标签 ['歌词控', '深夜灵魂']
  firstSongId?: number // 第一首听的歌 ID
}

/**
 * 灵感值行为枚举（与后端保持一致）
 */
export type InspireAction =
  | 'daily_checkin' // 每日打卡 +5
  | 'listen_song' // 听完一首歌 +3
  | 'short_comment' // 发布短评 +10
  | 'review' // 发布乐评 +30
  | 'lyric_card' // 创建歌词卡片 +15
  | 'comment_liked' // 评论被点赞 +2
  | 'like_others' // 点赞他人内容 +2
  | 'consecutive_7days' // 连续7天打卡奖励 +50

/**
 * 打卡响应
 */
export interface ICheckinRes {
  success: boolean
  pointsEarned: number // 本次获得的灵感值
  totalPoints: number // 打卡后的总灵感值
  consecutiveDays: number // 连续打卡天数
  bonusEarned?: number // 连续天数阶段奖励
}
