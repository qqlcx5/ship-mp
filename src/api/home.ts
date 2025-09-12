import { http } from '@/http/http'

export function getSlide() {
  return http.get<any>('/v2/slide/getall')
}
