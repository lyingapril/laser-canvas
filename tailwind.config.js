/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",             // 根目录 HTML
    "./src/**/*.{js,ts,jsx,tsx}" // 所有 React 源文件
  ],
  theme: {
    extend: {}, // 可自定义主题扩展
  },
  plugins: [], // 可按需添加，如 typography、forms 等
};
