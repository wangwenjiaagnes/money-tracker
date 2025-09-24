# Money Tracker - 记账软件

## 项目状态

这是一个基于Web的记账软件，使用Supabase作为后端数据库。

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **后端**: Supabase (PostgreSQL + Auth + Functions)
- **部署**: 静态文件服务器

## 功能模块

- `home.html` - 主页面，显示交易记录和概览
- `transaction.html` - 新增/编辑交易记录
- `analysis.html` - 数据分析页面
- `settings.html` - 设置页面
- `login.html` - 登录页面

## 本地运行

1. 启动本地服务器：
```bash
python3 -m http.server 8000
```

2. 访问应用：
- 主页: https://money-tracker-2025.netlify.app/home.html
- 登录: https://money-tracker-2025.netlify.app/login.html
- 测试: https://money-tracker-2025.netlify.app/test_basic.html

## 已知问题和修复

### 已修复的问题

1. **CNY币种符号错误** ✅
   - 问题: `symbol: '¥image.png'`
   - 修复: 改为 `symbol: '¥'`
   - 文件: `assets/js/config.js`

2. **登录重定向URL硬编码** ✅
   - 问题: 硬编码 `http://localhost:8000/home.html`
- 修复: 改为动态 `window.APP_CONFIG.urls.getPageUrl('home.html')`
   - 文件: `login.html`

3. **移动设备报销时间格式错误** ✅
   - 问题: 移动设备上 `toLocaleString('en-CA')` 产生错误格式 `"2025-08-28 12:00:36 PM:00"`
   - 修复: 改为使用 `new Date().toISOString()` 标准ISO格式
   - 文件: `home.html` (报销和取消报销函数)
   - 测试: `tests/test_reimbursement_time_fix.html`

4. **用户偏好记忆功能** ✅
   - 新增: 为币种、分类、类型添加localStorage记忆功能
   - 功能: 自动记录用户上次的选择，下次打开时自动填充
   - 文件: `assets/js/config.js`, `transaction.html`
   - 测试: `tests/test_user_preferences.html`

5. **移动端日期选择器默认值修复** ✅
   - 问题: 移动端日期选择器没有显示默认当前时间
   - 修复: 在多个地方添加日期设置检查，确保移动端也能正确显示默认日期
   - 文件: `transaction.html`
   - 影响: 创建新交易时，移动端和PC端都会显示当前时间作为默认值

6. **移动端localStorage安全检查修复** ✅
   - 问题: 移动端出现"undefined is not an object"错误，APP_CONFIG.userPreferences未定义
   - 修复: 在所有localStorage相关调用前添加安全检查
   - 文件: `transaction.html`
   - 影响: 确保移动端和PC端都能安全使用localStorage功能，避免JavaScript错误

### 待检查的问题

1. **Supabase配置完整性** - 需要验证所有页面的配置
2. **数据库连接** - 需要测试与Supabase的连接
3. **认证流程** - 需要测试Google OAuth登录
4. **功能完整性** - 需要测试各个页面的功能

## 测试

运行基本测试：
```bash
# 访问测试页面
https://money-tracker-2025.netlify.app/test_basic.html
```

## 数据库结构

项目使用Supabase，主要表包括：
- `transactions` - 交易记录
- `ledgers` - 账本
- `allowed_users` - 允许的用户
- `categories` - 分类

## 配置

- 支持多币种: SGD, CNY, USD, MYR
- 使用Google OAuth认证
- 支持报销状态管理

## 开发注意事项

1. 所有页面都需要通过HTTPS或localhost访问（Supabase要求）
2. 确保Supabase项目配置正确
3. 检查Google OAuth重定向URL设置

## 开发者指南

📖 **Cursor AI 开发指南**: [CURSOR_AI_GUIDE.md](CURSOR_AI_GUIDE.md) - 专为AI助手设计的完整开发指南

📋 **问题检查清单**: [docs/ISSUES_CHECKLIST.md](docs/ISSUES_CHECKLIST.md) - 已知问题和解决方案

📚 **技术文档**: [docs/](docs/) - 详细的技术文档和功能说明
