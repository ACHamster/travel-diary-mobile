export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/profile/index',
    'pages/login/index',
    'pages/my-posts/index',
    'pages/post-detail/index',
    'pages/post-edit/index',
    'pages/my-history/index',
    'pages/my-favorite/index',
    'pages/settings/index',
    'pages/register/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  // 添加全局分享配置
  enableShareAppMessage: true,
  enableShareTimeline: true,
  tabBar: {
    custom: true,
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  },
  // 修改分享配置
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于小程序位置接口的效果展示'
    }
  },
  requiredPrivateInfos: ['chooseLocation'],
})
