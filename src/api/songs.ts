import type { IMoodTag, IScoreReq, ISong, ISongItem } from './types/songs'
import { http } from '@/http/http'

/**
 * 获取歌曲列表（含当前用户锁定状态）
 */
export function getSongList() {
  return http.get<ISongItem[]>('/songs/list')
}

/**
 * 获取歌曲详情（含歌词、心情标签、我的评分）
 * @param id 歌曲 ID
 */
export function getSongDetail(id: number) {
  return http.get<ISong>(`/songs/${id}`)
}

/**
 * 获取歌词（含每行热度）
 * @param id 歌曲 ID
 */
export function getSongLyrics(id: number) {
  return http.get<ISong['lyrics']>(`/songs/${id}/lyrics`)
}

/**
 * 提交歌曲评分
 * @param data 评分数据
 */
export function submitScore(data: IScoreReq) {
  return http.post<void>(`/songs/${data.songId}/score`, data)
}

/**
 * 收藏 / 取消收藏歌曲
 * @param id 歌曲 ID
 * @param liked 是否收藏（true=收藏，false=取消）
 */
export function toggleSongLike(id: number, liked: boolean) {
  return http.post<void>(`/songs/${id}/like`, { liked })
}

/**
 * 投票心情标签
 * @param id 歌曲 ID
 * @param tagId 标签 ID
 * @param selected 是否选中
 */
export function voteMoodTag(id: number, tagId: string, selected: boolean) {
  return http.post<IMoodTag[]>(`/songs/${id}/mood`, { tagId, selected })
}
