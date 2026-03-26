import { http } from '@/http/http'

export interface ICommentItem {
  id: number | string
  user?: string
  username?: string
  nickname?: string
  avatar?: string
  content?: string
  likes?: number
  isLiked?: boolean
  replies?: number
  createdAt?: string
}

export function apiCommentListById(id: number | string) {
  return http.get<ICommentItem[]>(`/comment/list/${id}`)
}

export function apiCreateComment(params: Record<string, any>) {
  return http.post('/comment/create', params)
}

export function apiToggleLike(commentId: number | string) {
  return http.post(`/comment/like/${commentId}`)
}
