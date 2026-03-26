import type { UserLevel } from './growth'

/**
 * 乐评（长文）
 */
export interface IReview {
  id: number
  songId: number
  userId: number
  userNickname: string
  userAvatar: string
  userLevel: UserLevel
  content: string // 支持 Markdown，字数下限 100 字
  likeCount: number
  isLiked: boolean
  createdAt: string
  isFirst: boolean // 是否是该歌曲的首评（对应"首评人"徽章）
}

/**
 * 短评（轻量）
 */
export interface IShortComment {
  id: number
  songId: number
  userId: number
  userNickname: string
  userAvatar: string
  content: string // 最多 140 字
  likeCount: number
  isLiked: boolean
  createdAt: string
}

/**
 * 发布乐评请求参数
 */
export interface ICreateReviewReq {
  songId: number
  content: string
}

/**
 * 发布短评请求参数
 */
export interface ICreateShortCommentReq {
  songId: number
  content: string
}
