# LaserCanvas

一个使用现代前端技术构建的 Web 图像编辑器，专为激光雕刻场景设计。

## 🌟 功能亮点

- 🎨 基于 Fabric.js 的可编辑画布系统
- 🖼️ 支持图像（PNG/JPEG/SVG/DXF）导入与渲染
- ⚙️ 内置图像滤镜处理（WebGL 灰度滤镜）
- 💾 支持导出当前画布图像（PNG）
- 🧩 支持 SVG 矢量图导入与分组编辑
- 🎛️ 灰度滤镜开关控制
- 💡 前端技术栈：React + TypeScript + TailwindCSS + Vite

## 📦 项目结构概览

```
├── src/
│   ├── components/          # 可复用组件
│   ├── pages/               # 页面视图
│   ├── shaders/             # 图像处理模块
│   ├── utils/               # 工具函数
│   ├── main.tsx             # 入口文件
│   └── index.css            # Tailwind 样式
├── public/                  # 静态资源
├── README.md
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🚀 快速开始

```bash
npm install
npm run dev
```

## 🧑‍💻 技术关键词

- 前端工程化、图形渲染、Canvas、WebGL、图像格式解析、交互式编辑器、图像滤镜、图像导出、SVG解析、组件设计

## 📄 License

MIT
