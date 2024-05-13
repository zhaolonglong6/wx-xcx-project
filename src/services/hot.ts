import type { HotRecommendItem, PageParams } from '@/types/global'
import type { HotResult } from '@/types/hot'
import { http } from '@/utils/net'

export const getHotRecommendAPI = (url: string, data: PageParams & { subType?: string }) => {
  return http<HotResult>({
    url,
    data,
    method: 'GET',
  })
}
