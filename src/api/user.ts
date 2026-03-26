import { http } from '@/http/http'

export interface IUserInfo {
  id?: number | string
  nickname?: string
  avatar?: string
  inspirationPoints?: number
  streakDays?: number
  checkedInToday?: boolean
}

export function apiUserInfo() {
  return http.get<IUserInfo>('/user/info')
}

export function apiCheckin() {
  return http.post('/user/checkin')
}
