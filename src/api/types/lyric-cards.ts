/**
 * 卡片氛围主题
 * midnight: 深夜 | morning: 清晨 | rain: 雨天
 */
export type CardTheme = 'midnight' | 'morning' | 'rain'

/**
 * 「歌词击中了我」卡片
 */
export interface ILyricCard {
  id: number
  songId: number
  songTitle: string
  songCoverUrl: string
  lyricText: string // 选中的那句歌词
  lyricIndex: number // 歌词行索引（对应 ILyricLine.index）
  feeling?: string // 用户写的感受（可为空）
  theme: CardTheme // 卡片氛围主题
  userId: number
  userNickname: string
  userAvatar: string
  likeCount: number
  isLiked: boolean // 当前用户是否点"也击中了我"
  isSaved: boolean // 是否已收藏
  createdAt: string
}

/**
 * 共鸣回复
 */
export interface IResonateComment {
  id: number
  cardId: number
  userId: number
  userNickname: string
  userAvatar: string
  content: string
  createdAt: string
}

/**
 * 创建卡片请求参数
 */
export interface ICreateLyricCardReq {
  songId: number
  lyricText: string
  lyricIndex: number
  feeling?: string
  theme: CardTheme
}

/**
 * 卡片 Feed 查询参数
 */
export interface ILyricCardFeedQuery {
  page?: number
  pageSize?: number
  songId?: number // 筛选特定歌曲
  lyricIndex?: number // 筛选特定歌词行
  sort?: 'latest' | 'hot' // 排序方式
}
