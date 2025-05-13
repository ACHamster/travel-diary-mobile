import Taro from '@tarojs/taro'
import { BASE_URL } from '../config'

// 定义刷新令牌接口的返回数据类型
interface RefreshResponse {
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
  token: string;
  refreshToken: string;
}

// 请求拦截器
const requestInterceptor = function (chain) {
  const requestParams = chain.requestParams
  const { header, ...otherParams } = requestParams

  // 合并headers
  const newHeader = {
    'Content-Type': 'application/json',
    ...header
  }

  // 添加token
  const token = Taro.getStorageSync('token');
  if (token) {
    newHeader['Authorization'] = `Bearer ${token}`
  }

  return chain.proceed({
    ...otherParams,
    header: newHeader
  })
}


interface RequestOptions extends Omit<Taro.request.Option, 'url'> {
  url: string
  _retry?: boolean
  redirectOnAuth?: boolean // 新增：401时是否需要跳转登录页
}

// 响应拦截器
const responseInterceptor = function (chain) {
  const requestParams = chain.requestParams;
  console.log(requestParams);

  return chain.proceed(requestParams).then(async res => {
    const errorCode = res.data?.errorCode;
    if (
      (res.statusCode === 401 || res.statusCode === 403 || res.data?.statusCode === 401) &&
      !requestParams._retry &&
      !requestParams.url.includes('/auth/refresh') &&
      errorCode !== "USER_ALREADY_REGISTERED"
    ) {
      requestParams._retry = true

      try {
        // 尝试刷新token
        const refreshToken = Taro.getStorageSync('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        const refreshRes = await Taro.request<RefreshResponse>({
          url: `${BASE_URL}/auth/refresh`,
          method: 'POST',
          data: { refreshToken },
          header: {
            'Content-Type': 'application/json'
          }
        })

        // 检查刷新结果
        const refreshData: RefreshResponse = refreshRes
        console.log(refreshRes);

        if (refreshData?.token) {
          // 保存新token并重试原请求
          Taro.setStorageSync('token', refreshData.token)
          Taro.setStorageSync('refreshToken', refreshData.refreshToken)
          Taro.setStorageSync('userInfo', refreshData.user)
          Taro.setStorageSync('userId', refreshData.user.id)

          const retryRes = await request({
            ...requestParams,
            url: requestParams.url.replace(BASE_URL, ''),
            header: {
              ...requestParams.header,
              'Authorization': `Bearer ${refreshData.token}`
            }
          })
          return retryRes.data
        } else {
          throw new Error('Token refresh failed')
        }
      } catch (error) {
        // 刷新失败时，根据 redirectOnAuth 决定是否跳转
        Taro.removeStorageSync('token')
        Taro.removeStorageSync('refreshToken')
        Taro.removeStorageSync('userInfo')

        if (requestParams.data.redirectOnAuth) {
          Taro.navigateTo({ url: '/pages/login/index' })
        }
        return Promise.reject(error)
      }
    }

    if (res.statusCode >= 400) {
      return Promise.reject(res.data)
    }

    return res.data
  }).catch(error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  })
}

// 添加拦截器
Taro.addInterceptor(requestInterceptor)
Taro.addInterceptor(responseInterceptor)


export const request = (options: RequestOptions) => {
  return Taro.request({
    ...options,
    url: `${BASE_URL}${options.url}`,
  })
}

// 封装常用的请求方法
export const get = (url: string, data?: any) => {
  return request({
    url,
    method: 'GET',
    data
  })
}

export const post = (url: string, data?: any) => {
  return request({
    url,
    method: 'POST',
    data
  })
}

export const put = (url: string, data?: any) => {
  return request({
    url,
    method: 'PUT',
    data
  })
}

export const del = (url: string, data?: any) => {
  return request({
    url,
    method: 'DELETE',
    data
  })
}

