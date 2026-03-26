import { http } from '@/http/http'

export interface IMusicItem {
  id: number | string
  title?: string
  name?: string
  artist?: string
  singer?: string
  lyric?: string
  cover?: string
  coverUrl?: string
  listeners?: number | string
  tag?: string
}

export function apiMusicList(params?: Record<string, any>) {
  return http.get<IMusicItem[]>('/music/list', params)
}

export function apiRandomMusic(params?: Record<string, any>) {
  return http.get<IMusicItem[] | IMusicItem>('/music/randomMusic', params)
}

export function apiMusicDetail(id: number | string) {
  return http.get<IMusicItem>(`/music/detail/${id}`)
}

export function apiToggleFavorite(musicId: number | string, isFavorite: boolean) {
  return http.post('/music/favorite', { musicId, isFavorite })
}
