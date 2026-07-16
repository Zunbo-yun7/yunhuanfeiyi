# 云焕非遗 - 英歌文化数字展示平台

> 走进普宁英歌，感受非遗魅力

## 项目简介

本项目是一个面向普宁英歌文化的数字展示平台，旨在通过现代化的 Web 技术，将国家级非物质文化遗产——英歌舞的历史、文化、技艺等内容进行数字化呈现，实现传统文化的传承与创新。

## 技术栈

### 前端

| 技术 | 版本 | 说明 |
|------|------|------|
| React | 18.3 | 前端框架 |
| TypeScript | 5.8 | 类型安全 |
| Tailwind CSS | 3.4 | 样式框架 |
| GSAP | 3.15 | 动画引擎 |
| React Router | 7.3 | 路由管理 |
| Zustand | 5.0 | 状态管理 |
| Swiper | 14.0 | 轮播组件 |
| @dnd-kit | 6.3 | 拖拽排序 |

### 后端

| 技术 | 版本 | 说明 |
|------|------|------|
| Node.js | 20+ | 运行环境 |
| Express | 4.18 | 后端框架 |
| MySQL | 8.0+ | 数据库 |
| axios | 1.7 | HTTP 客户端 |

### 构建工具

| 工具 | 版本 | 说明 |
|------|------|------|
| Vite | 6.3 | 构建工具 |
| ESLint | 9.25 | 代码检查 |

## 功能特性

### 用户端

- **首页**：Hero 区域、英歌队展示、展演视频、通知公告、阵法展示、文化展品、统计数据
- **关于英歌**：历史渊源、艺术特色、普宁特色、文化价值
- **新坛英歌**：村庄介绍、英歌队介绍、成就展示、训练风采、传承故事
- **动作图谱**：英歌动作分类、动作展示、动作详解
- **脸谱装备**：脸谱、服装、道具展示
- **人物故事**：传承人、队员故事
- **AI 助手**：智能问答、英歌知识查询

### 管理后台

- **登录认证**：管理员登录、JWT 令牌
- **内容管理**：首页、关于英歌、新坛英歌、动作图谱、脸谱装备、人物故事
- **日志管理**：实践日志增删改查、置顶功能
- **图片上传**：支持文件选择器、拖拽上传、URL 输入
- **拖拽排序**：支持分类、物品拖拽排序
- **数据统计**：访问量统计

## 项目结构

```
├── src/                    # 前端源代码
│   ├── components/         # 公共组件
│   │   ├── Card.tsx        # 卡片组件
│   │   ├── ImageUploader.tsx # 图片上传组件
│   │   ├── SortableList.tsx  # 拖拽排序组件
│   │   └── ...
│   ├── hooks/              # 自定义 Hooks
│   │   ├── useScrollAnimation.ts # 滚动动画
│   │   ├── useParallax.ts       # 视差效果
│   │   └── ...
│   ├── pages/              # 页面组件
│   │   ├── Home.tsx        # 首页
│   │   ├── admin/          # 管理后台页面
│   │   └── ...
│   ├── lib/                # 工具库
│   │   └── api.ts          # API 封装
│   ├── store/              # 状态管理
│   │   └── admin.ts        # 管理员状态
│   ├── data/               # Mock 数据
│   ├── index.css           # 全局样式
│   └── main.tsx            # 入口文件
├── server/                 # 后端服务
│   ├── routes/             # 路由定义
│   ├── services/           # 业务逻辑
│   ├── scripts/            # 脚本文件
│   ├── index.js            # 服务入口
│   └── .env                # 环境变量
├── package.json            # 前端依赖
├── server/package.json     # 后端依赖
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
└── tailwind.config.js      # Tailwind 配置
```

## 快速开始

### 环境要求

- Node.js >= 20.x
- MySQL >= 8.0
- npm >= 9.x

### 安装步骤

#### 1. 克隆项目

```bash
git clone <repository-url>
cd 三下乡
```

#### 2. 安装前端依赖

```bash
npm install
```

#### 3. 安装后端依赖

```bash
cd server
npm install
cd ..
```

#### 4. 配置数据库

编辑 `server/.env` 文件：

```env
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=yingge_db

# 图床配置
IMAGEBED_API_KEY=your_api_key
IMAGEBED_API_URL=https://www.superbed.cn/api/upload
```

#### 5. 创建数据库

```bash
mysql -u your_username -p
CREATE DATABASE yingge_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit
```

#### 6. 创建表结构

```bash
cd server
node scripts/createTables.js
cd ..
```

#### 7. 初始化数据

```bash
cd server
node scripts/initDatabase.js
cd ..
```

#### 8. 启动服务

**方式一：分别启动（开发模式）**

终端 1 - 启动后端：
```bash
cd server
npm run dev
```

终端 2 - 启动前端：
```bash
npm run dev
```

**方式二：使用 npm-run-all（推荐）**

先安装：
```bash
npm install -g npm-run-all
```

然后在项目根目录：
```bash
npm-run-all --parallel dev:server dev:client
```

### 访问地址

- **前端页面**：http://localhost:3000
- **管理后台**：http://localhost:3000/admin/login
- **后端 API**：http://localhost:4000/api

### 默认管理员账号

- **用户名**：admin
- **密码**：admin123

> 建议首次登录后修改密码

## 部署方案

### 方案一：Docker 部署（推荐）

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d
```

### 方案二：传统部署

#### 前端部署

```bash
npm run build

# 将 dist 目录部署到静态服务器
# 如 Nginx、Apache、CDN 等
```

#### 后端部署

```bash
cd server
npm install --production
NODE_ENV=production npm start
```

#### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api/ {
        proxy_pass http://localhost:4000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## API 接口

### 首页
- `GET /api/home` - 获取首页数据

### 关于英歌
- `GET /api/about` - 获取关于英歌数据

### 新坛英歌
- `GET /api/xintan` - 获取新坛英歌数据

### 动作图谱
- `GET /api/actions` - 获取动作数据

### 脸谱装备
- `GET /api/equipment` - 获取装备数据（前端展示）
- `GET /api/equipment/admin` - 获取装备数据（管理后台）

### 人物故事
- `GET /api/people` - 获取人物数据

### 日志管理
- `GET /api/logs` - 获取日志列表
- `POST /api/logs` - 创建日志
- `PUT /api/logs/:id` - 更新日志
- `DELETE /api/logs/:id` - 删除日志

### 图片上传
- `POST /api/upload/image` - 上传单张图片
- `POST /api/upload/images` - 批量上传图片

### 管理员认证
- `POST /api/admin/login` - 管理员登录
- `POST /api/admin/register` - 管理员注册

## 开发规范

### 代码风格

- 使用 TypeScript 严格模式
- 使用 ESLint 进行代码检查
- 组件命名使用 PascalCase
- 文件命名使用 kebab-case
- 函数命名使用 camelCase

### 提交规范

```
<type>(<scope>): <description>

<type>:
  feat     - 新功能
  fix      - 修复 Bug
  refactor - 重构
  style    - 样式调整
  docs     - 文档更新
  test     - 测试用例

<scope>:
  组件名或模块名

示例：
feat(Navbar): 添加滚动联动动画
fix(Home): 修复卡片悬浮效果
```

## 版本历史

### v0.0.1 (2026-07-14)

- 项目初始化
- 完成基础页面搭建
- 实现滚动触发动画
- 实现图片上传功能
- 实现拖拽排序功能
- 完成管理员后台
- 集成图床 API
- 完成数据库设计与初始化

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系项目负责人。