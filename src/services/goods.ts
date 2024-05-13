import type { GoodsResult } from '@/types/goods'
import { http } from '@/utils/net'

export const getGoodsByIdAPI = (id: string) => {
  return http<GoodsResult>({
    url: '/goods',
    method: 'GET',
    data: {
      id,
    },
  })
}
