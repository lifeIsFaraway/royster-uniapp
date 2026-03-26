import type { ICreateReviewReq, ICreateShortCommentReq, IReview, IShortComment } from './types/reviews'
import { http } from '@/http/http'

/**
 * 获取歌曲的乐评列表
 * @param songId 歌曲 ID
 */
export function getReviews(songId: number) {
  return http.get<IReview[]>('/reviews', { songId })
}

/**
 * 发布乐评
 * @param data 乐评内容
 */
export function createReview(data: ICreateReviewReq) {
  return http.post<IReview>('/reviews', data)
}

/**
 * 点赞 / 取消点赞乐评
 * @param id 乐评 ID
 * @param liked 是否点赞
 */
export function toggleReviewLike(id: number, liked: boolean) {
  return http.post<void>(`/reviews/${id}/like`, { liked })
}

/**
 * 获取歌曲的短评列表
 * @param songId 歌曲 ID
 */
export function getShortComments(songId: number) {
  return http.get<IShortComment[]>('/short-comments', { songId })
}

/**
 * 发布短评
 * @param data 短评内容
 */
export function createShortComment(data: ICreateShortCommentReq) {
  return http.post<IShortComment>('/short-comments', data)
}

/**
 * 点赞 / 取消点赞短评
 * @param id 短评 ID
 * @param liked 是否点赞
 */
export function toggleShortCommentLike(id: number, liked: boolean) {
  return http.post<void>(`/short-comments/${id}/like`, { liked })
}
