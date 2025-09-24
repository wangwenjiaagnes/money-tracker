# 部署配置指南

## 环境配置

### 开发环境 (Development)
- 域名: `http://localhost:8000`
- 配置位置: `assets/js/config.js`

### 生产环境 (Production)
- 域名: `https://money-tracker-2025.netlify.app`
- 配置位置: `assets/js/config.js`

## 需要修改的文件

### 1. 核心配置文件
- `assets/js/config.js` - 主要配置文件，包含所有URL和API配置

### 2. 文档文件 (可选)
- `README.md` - 更新访问地址说明
- `start.sh` - 本地开发启动脚本
- `ISSUES_CHECKLIST.md` - 问题清单
- `docs/CATEGORY_ICON_README.md` - 文档说明

## 部署步骤

### 1. 更新配置文件
在 `assets/js/config.js` 中，所有URL都会自动使用当前域名：
```javascript
// 自动获取当前域名
getBaseUrl() {
  return window.location.origin;
}
```

### 2. 更新文档 (已完成)
文档已更新为你的生产域名：
- `README.md` ✅
- `ISSUES_CHECKLIST.md` ✅
- `docs/CATEGORY_ICON_README.md` ✅

### 3. 部署到服务器
将整个项目文件夹上传到你的Web服务器。

### 4. 配置HTTPS
确保生产环境使用HTTPS，因为Supabase要求安全连接。

## 注意事项

1. **Supabase配置**: 所有Supabase配置都是线上地址，无需修改
2. **动态URL**: 代码中使用 `window.APP_CONFIG.urls.getPageUrl()` 自动获取正确URL
3. **OAuth重定向**: 登录重定向已配置为动态获取当前域名
4. **HTTPS要求**: 生产环境必须使用HTTPS，Supabase不支持HTTP

## 验证部署

1. 访问你的域名
2. 测试登录功能
3. 验证所有页面功能正常
4. 检查Supabase连接
