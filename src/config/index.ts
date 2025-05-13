const config = {
  development: {
    BASE_URL: 'http://localhost:3000/api'
  },
  production: {
    BASE_URL: 'https://travel.achamster.live/api' // 生产环境API地址
  }
}

// 根据编译时的环境变量选择配置
export const ENV = 'development'
// export const ENV = 'production'
export const { BASE_URL } = config[ENV]

export default config
