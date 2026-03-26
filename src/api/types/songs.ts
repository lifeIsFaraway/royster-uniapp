import type { UserLevel } from './growth'

/**
 * 歌词行
 */
export interface ILyricLine {
  index: number
  text: string
  timeMs: number // 时间戳（毫秒，用于歌词同步滚动）
  cardCount: number // 被"歌词击中了我"创建的数量（热度高亮）
}

/**
 * 评分（细分维度）
 */
export interface IScore {
  overall: number // 综合评分 1-10
  melody?: number // 旋律
  lyrics?: number // 歌词
  arrangement?: number // 编曲
  emotion?: number // 情感共鸣
}

/**
 * 心情标签
 */
export interface IMoodTag {
  id: string
  label: string // '治愈' | '想哭' | '上头' | '发疯'
  count: number // 投票人数
  isSelected: boolean // 当前用户是否已选择
}

/**
 * 歌曲列表项（轻量，用于列表展示）
 */
export interface ISongItem {
  id: number
  title: string
  coverUrl: string
  duration: number // 时长（秒）
  releaseDate: string
  isLocked: boolean // 是否对当前用户锁定
  unlockLevel: UserLevel // 需要什么等级才能解锁
  isHiddenUnlock?: boolean // 是否为隐藏解锁歌曲
  avgScore: number // 平均综合评分
  reviewCount: number // 乐评数量
  lyricCardCount: number // 歌词卡片总数
  isLiked: boolean // 是否收藏
}

/**
 * 歌曲详情（完整，包含歌词）
 */
export interface ISong extends ISongItem {
  audioUrl: string // 音频地址
  lyrics: ILyricLine[] // 歌词行数组
  moodTags: IMoodTag[] // 心情标签
  myScore?: IScore // 当前用户的评分
}

/**
 * 提交评分的请求参数
 */
export interface IScoreReq {
  songId: number
  overall: number
  melody?: number
  lyrics?: number
  arrangement?: number
  emotion?: number
}
