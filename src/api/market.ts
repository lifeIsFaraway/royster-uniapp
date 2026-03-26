import { http } from '@/http/http'

export interface IMarketItem {
  id: number | string
  title?: string
  name?: string
  cover?: string
  price?: number
}

export function apiMarketList(params?: Record<string, any>) {
  return http.get<IMarketItem[]>('/market/list', params)
}
