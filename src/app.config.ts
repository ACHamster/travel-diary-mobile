export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/profile/index',
    'pages/login/index',
    'pages/my-posts/index',
    'pages/post-detail/index',
    'pages/post-edit/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
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
  }
})
