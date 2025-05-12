const config = {
  development: {
    BASE_URL: 'http://localhost:3000/api'
  },
  production: {
    BASE_URL: 'https://travel.achamster.live/api' // 生产环境API地址
  }
}

// 根据编译时的环境变量选择配置
export const ENV = 'development' // 在小程序环境中，我们默认使用开发环境配置
// export const ENV = 'production' // 在小程序环境中，我们默认使用生产环境配置
export const { BASE_URL } = config[ENV]

export default config
