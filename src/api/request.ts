import Taro from '@tarojs/taro'
import { BASE_URL } from '../config'

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
  console.log(token);
  if (token) {
    newHeader['Authorization'] = `Bearer ${token}`
  }

  return chain.proceed({
    ...otherParams,
    header: newHeader
  })
}

// 响应拦截器
const responseInterceptor = function (chain) {
  const requestParams = chain.requestParams

  return chain.proceed(requestParams).then(async res => {
    // 检查是否是401/403且未重试过，并且不是刷新token的请求本身
    if (
      (res.statusCode === 401 || res.statusCode === 403 || res.data?.statusCode === 401) &&
      !requestParams._retry &&
      !requestParams.url.includes('/auth/refresh')
    ) {
      requestParams._retry = true

      try {
        // 尝试刷新token
        const refreshToken = Taro.getStorageSync('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        const refreshRes = await Taro.request({
          url: `${BASE_URL}/auth/refresh`,
          method: 'POST',
          data: { refreshToken },
          header: {
            'Content-Type': 'application/json'
          }
        })

        console.log('refresh res',refreshRes);

        // 检查刷新结果
        console.log(refreshRes.token);
        if (refreshRes.statusCode === 201 && refreshRes?.token) {
          console.log('refresh res',refreshRes.data);
          // 保存新token
          Taro.setStorageSync('token', refreshRes.data.token);
          Taro.setStorageSync('refreshToken', refreshRes.data.refreshToken);
          Taro.setStorageSync('userInfo', res.data.user);
          // 保存用户ID，方便后续获取完整信息
          Taro.setStorageSync('userId', res.data.user.id);

          // 使用新token重试原请求并等待结果
          const retryRes = await request({
            ...requestParams,
            header: {
              ...requestParams.header,
              'Authorization': `Bearer ${refreshRes.data.data.token}`
            }
          })
          return retryRes.data
        } else {
          throw new Error('Token refresh failed')
        }
      } catch (error) {
        // 刷新失败，清除用户信息并跳转登录页
        console.error('Token refresh failed:', error)
        Taro.removeStorageSync('token')
        Taro.removeStorageSync('refreshToken')
        Taro.removeStorageSync('userInfo')
        Taro.navigateTo({ url: '/pages/login/index' })
        return Promise.reject(error)
      }
    }

    // 其他错误直接返回
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

// 封装请求方法
interface RequestOptions extends Omit<Taro.request.Option, 'url'> {
  url: string
  _retry?: boolean
}

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
