import type {
  ICreateLyricCardReq,
  ILyricCard,
  ILyricCardFeedQuery,
  IResonateComment,
} from './types/lyric-cards'
import { http } from '@/http/http'

/**
 * 获取全局「歌词击中了我」Feed
 * @param query 查询参数（分页、筛选、排序）
 */
export function getLyricCardFeed(query?: ILyricCardFeedQuery) {
  return http.get<ILyricCard[]>('/lyric-cards/feed', query)
}

/**
 * 获取某首歌的所有歌词卡片
 * @param songId 歌曲 ID
 */
export function getLyricCardsBySong(songId: number) {
  return http.get<ILyricCard[]>('/lyric-cards', { songId })
}

/**
 * 获取某句歌词的所有卡片（「同一句歌词·不同人生」）
 * @param songId 歌曲 ID
 * @param lyricIndex 歌词行索引
 */
export function getLyricCardsByLyric(songId: number, lyricIndex: number) {
  return http.get<ILyricCard[]>('/lyric-cards', { songId, lyricIndex })
}

/**
 * 创建歌词卡片
 * @param data 卡片创建参数
 */
export function createLyricCard(data: ICreateLyricCardReq) {
  return http.post<ILyricCard>('/lyric-cards', data)
}

/**
 * 「这句话也击中了我」— 点赞/取消点赞卡片
 * @param id 卡片 ID
 * @param liked 是否点赞
 */
export function toggleLyricCardLike(id: number, liked: boolean) {
  return http.post<void>(`/lyric-cards/${id}/like`, { liked })
}

/**
 * 收藏 / 取消收藏卡片
 * @param id 卡片 ID
 * @param saved 是否收藏
 */
export function toggleLyricCardSave(id: number, saved: boolean) {
  return http.post<void>(`/lyric-cards/${id}/save`, { saved })
}

/**
 * 获取卡片的共鸣回复列表
 * @param id 卡片 ID
 */
export function getResonateComments(id: number) {
  return http.get<IResonateComment[]>(`/lyric-cards/${id}/resonate`)
}

/**
 * 发布共鸣回复
 * @param id 卡片 ID
 * @param content 回复内容
 */
export function createResonateComment(id: number, content: string) {
  return http.post<IResonateComment>(`/lyric-cards/${id}/resonate`, { content })
}
