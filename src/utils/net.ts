import { useMemberStore } from "@/stores"

const baseUrl = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'

type Data<T> = {
  code: string
  msg: string
  result: T
}
export const http = <T>(option: UniApp.RequestOptions) => {
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...option,
      success(res) {
        // 状态码 2xx，参考 axios 的设计
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as Data<T>)
        } else if (res.statusCode === 401) {
          // 401错误  -> 清理用户信息，跳转到登录页
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          uni.navigateTo({ url: '/pages/login/login' })
          reject(res)
        } else {
          // 其他错误 -> 根据后端错误信息轻提示
          uni.showToast({
            title: (res.data as Data<T>).msg || '请求错误',
            icon: 'none',
          })
          reject(res)
        }
      },
      fail(err) {
        uni.showToast({
          title: '网络错误，换个网络试试',
          icon: 'none',
        })
        reject(err)
      },
    })
  })
}
uni.addInterceptor('request', {
  invoke(args: UniApp.RequestOptions) {
    if (!args.url.includes('http')) {
      args.url = baseUrl + args.url
    }
    // 请求超时
    args.timeout = 10000
    // 配置请求头
    args.header = {
      'source-client': 'miniapp',
      ...args.header,
    }
    // 添加token
    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    if (token) {
      args.header.Authorization = token
    }
  },
})
