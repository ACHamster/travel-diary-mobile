# 2025携程前端训练营大作业旅游日记-移动端

本项目是一个基于 Taro 和 React 的小程序项目，旨在提供一个记录和分享旅行日记的平台。用户可以记录旅行中的精彩瞬间，分享旅行体验，并与其他旅行爱好者互动。

## 环境要求

- Node.js >= 16
- pnpm >= 8
- 微信开发者工具
- Taro CLI (`pnpm install -g @tarojs/cli`)

## 项目特性

- **移动端支持**：
  - 完整支持微信小程序
  - 响应式设计，适配不同尺寸设备
  
- **现代化技术栈**：
  - 基于 Taro 3.x 框架
  - 使用 React 18 Hooks
  - TypeScript 类型支持
  - TailwindCSS 样式解决方案
  
- **丰富的功能**：
  - 旅行日记创建与编辑
  - 图片上传与预览
  - 位置服务集成（模拟）
  - 用户认证系统



## 项目结构

```
├── src/                    # 源代码目录
│   ├── api/               # API 封装
│   ├── components/        # 公共组件
│   ├── pages/             # 页面
│   ├── lib/               # 工具库
│   ├── constants/         # 常量定义
│   ├── icons/             # 图标资源
│   ├── types/            # 类型定义
│   ├── hooks/            # 自定义 Hooks
│   ├── stores/           # 状态管理
│   ├── app.ts            # 应用入口
│   └── app.config.ts     # 应用配置
├── config/                # 环境配置
├── types/                 # 全局类型定义
└── public/               # 静态资源
```

## 安装依赖

在项目根目录下运行以下命令安装依赖：

```bash
pnpm install
```

## 开发调试
因为开发者认证存在难度和经济问题，本项目目前只能在开发环境下运行。因此需要下载微信开发者工具以查看运行效果。

根据目标平台运行以下命令启动开发环境：

- 微信小程序：

  ```bash
  pnpm run dev:weapp
  ```
在微信开发者工具中导入dist文件夹即可看到运行效果。  
注意：如果使用production环境下的服务器，在初次使用时可能需要等待ServerLess 的Azure SQL被唤醒后才能获取到数据。

## 构建

根据目标平台运行以下命令进行构建：

- 微信小程序：

  ```bash
  pnpm run build:weapp
  ```

## 使用的主要技术

- [Taro](https://taro-docs.jd.com/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)

## 开发指南

### 配置开发环境

1. 克隆项目
```bash
git clone [项目地址]
cd travel-dairy-mobile
```

2. 安装依赖
```bash
pnpm install
```



### 开发规范

- 遵循 TypeScript 的类型定义规范
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 提交代码前运行 `pnpm lint` 检查代码规范

### 调试说明

1. 本地开发时需要启动微信开发者工具
2. 开发者工具中需要开启"ES6 转 ES5"、"增强编译"等选项
3. 如遇到网络请求问题，请检查域名是否已配置到小程序后台

## 项目预览

[此处可以添加几张核心功能的截图]


