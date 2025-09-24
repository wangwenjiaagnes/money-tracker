# Cursor AI 开发指南

> **专为 Cursor AI 设计的项目开发指南**  
> 包含所有开发所需的关键信息，无需重复解释技术细节

## 项目概述

这是一个基于Web的记账软件，使用Supabase作为后端数据库。项目采用前端HTML/CSS/JavaScript + 后端Supabase (PostgreSQL) 的架构。

**项目状态**: 生产就绪，已部署到 https://money-tracker-2025.netlify.app

## 核心技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **后端**: Supabase (PostgreSQL + Auth + RPC Functions)
- **数据库**: PostgreSQL (通过Supabase)
- **认证**: Google OAuth (通过Supabase Auth)
- **部署**: 静态文件服务器

## 重要技术决策

### 1. 时区处理架构
项目已建立完整的时区处理架构，**所有新功能开发必须遵循**：

- **查询数据库时使用UTC时间**
- **显示给用户时使用本地时间**
- **始终使用 TimezoneManager 类进行转换**

详细指南：`docs/TIMEZONE_GUIDE.md`

### 2. 数据库设计
- 使用Supabase PostgreSQL，**不是本地数据库**
- 主要表：`transactions`, `ledgers`, `allowed_users`, `categories`
- 时区相关字段：
  - `transaction_date`: UTC时间 (TIMESTAMPTZ)
  - `transaction_date_local`: 本地时间字符串 (TEXT)

### 3. 前端架构
- 单页面应用，无框架依赖
- 使用 `window.timezoneManager` 全局时区管理器
- 所有页面都需要初始化时区管理器

## 开发规范

### 1. 新功能开发流程
1. 参考现有代码实现方式
2. 遵循时区处理指南
3. 使用Supabase RPC函数进行复杂查询
4. 确保包含 `created_at` 字段

### 2. 代码风格
- 使用中文注释
- 遵循现有代码结构
- 使用ES6+语法
- 错误处理使用 try-catch

### 3. 数据库操作
- 使用Supabase客户端API
- 复杂查询使用RPC函数
- 时区转换使用 `get_utc_date_range` SQL函数

## 关键文件说明

### 核心文件
- `assets/js/timezoneManager.js` - 时区管理器类
- `assets/js/config.js` - 应用配置
- `assets/js/supabase.js` - Supabase客户端配置

### 页面文件
- `home.html` - 主页面，交易记录和概览
- `transaction.html` - 新增/编辑交易
- `analysis.html` - 数据分析
- `settings.html` - 设置页面
- `login.html` - 登录页面

### 资源文件
- `assets/svg/` - SVG图标文件目录
  - `undo.svg` - 撤销/取消图标
  - `complete.svg` - 完成/确认图标
  - `delete.svg` - 删除图标
  - `edit.svg` - 编辑图标
  - `view.svg` - 查看图标
  - `add.svg` - 添加图标
  - `home.svg` - 首页图标
  - `analysis.svg` - 分析图标
  - `settings.svg` - 设置图标
  - `close.svg` - 关闭图标
  - `copy.svg` - 复制图标

### 文档文件
- `docs/TIMEZONE_GUIDE.md` - 详细时区处理指南
- `docs/CATEGORY_ICON_README.md` - Category Icon功能说明
- `docs/ISSUES_CHECKLIST.md` - 问题检查清单
- `config/deploy-config.md` - 部署配置指南
- `CURSOR_AI_GUIDE.md` - 本文件，Cursor AI开发指南

## 常见开发任务

### 1. 添加新页面
```javascript
// 必须包含的初始化代码
<script src="assets/js/config.js"></script>
<script src="assets/js/supabase.js"></script>
<script src="assets/js/timezoneManager.js"></script>

// 初始化时区管理器
window.timezoneManager = new TimezoneManager(supabase);
```

### 2. 数据库查询
```javascript
// 简单查询
const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('ledger_id', ledgerId);

// 复杂查询（使用时区转换）
const utcRange = await window.timezoneManager.getUTCDateRange(startDate, endDate);
const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .gte('transaction_date', utcRange.utc_start)
    .lte('transaction_date', utcRange.utc_end);
```

### 3. 创建新记录
```javascript
const transactionData = {
    // ... 其他字段
    transaction_date: isoDateTime, // UTC时间
    transaction_date_local: window.timezoneManager.getLocalTimeString(isoDateTime),
    created_at: new Date().toISOString(), // 必须包含
    // 时间相关字段必须使用 toISOString()
    reimbursement_date: new Date().toISOString(), // ✅ 正确
    // reimbursement_date: new Date().toLocaleString('en-CA') + ':00', // ❌ 错误
};
```

### 4. 时间格式处理规范

**存储到数据库的时间字段**：
```javascript
// ✅ 正确 - 使用标准ISO格式
const timeFields = {
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    reimbursement_date: new Date().toISOString(),
    reimbursement_canceler_date: new Date().toISOString(),
    transaction_date: new Date().toISOString()
};
```

**显示给用户的时间**：
```javascript
// ✅ 正确 - 使用本地化格式
const displayTime = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
});
```

**绝对禁止的错误做法**：
```javascript
// ❌ 错误 - 手动拼接时间字符串
const wrongTime = new Date().toLocaleString('en-CA').replace(',', '') + ':00';
```

### 5. 使用SVG图标
```html
<!-- 在HTML中使用SVG图标 -->
<img src="assets/svg/undo.svg?v=2" alt="Cancel" width="16" height="16">

<!-- 在JavaScript中动态生成 -->
function createIconButton(iconName, altText, onClick) {
    return `<button onclick="${onClick}">
        <img src="assets/svg/${iconName}.svg?v=2" alt="${altText}" width="16" height="16">
    </button>`;
}
```

**SVG文件位置**: `assets/svg/` 目录
**缓存策略**: 使用 `?v=2` 查询参数进行缓存控制

### 6. 设置筛选器默认值
```javascript
// 在loadLedgers函数中设置默认值
async function loadLedgers() {
    try {
        const { data, error } = await supabase
            .from('ledgers')
            .select('id, name')
            .eq('is_active', true)
            .order('name');
        
        if (error) throw error;
        
        const select = document.getElementById('ledger-filter');
        select.innerHTML = '<option value="all">All Ledgers</option>';
        
        data.forEach(ledger => {
            const option = document.createElement('option');
            option.value = ledger.id;
            option.textContent = ledger.name;
            select.appendChild(option);
        });
        
        // 如果没有保存的筛选器状态，设置第一个账本为默认值
        const saved = sessionStorage.getItem('moneyTrackerFilters');
        if (!saved && data.length > 0) {
            globalFilters.ledger = data[0].id;
            saveFilters();
        }
    } catch (error) {
        console.error('Error loading ledgers:', error);
    }
}
```

**筛选器状态管理**: 使用sessionStorage保存用户筛选器偏好
**默认值逻辑**: 首次访问时选择第一个选项，后续保持用户选择

## 已知问题和解决方案

### 1. 时区偏移问题
- **问题**: 日期显示错误，如8月25日显示为"Yesterday"
- **解决**: 使用 `TimezoneManager` 类进行时区转换

### 2. created_at 字段缺失
- **问题**: "null value in column created_at violates not-null constraint"
- **解决**: 创建记录时必须包含 `created_at: new Date().toISOString()`

### 3. 时区管理器未初始化
- **问题**: "supabase.rpc is not a function"
- **解决**: 确保在使用前初始化 `window.timezoneManager = new TimezoneManager(supabase)`

### 4. 已修复的历史问题
- ✅ CNY币种符号错误 (`assets/js/config.js`)
- ✅ 登录重定向URL硬编码 (`login.html`)
- ✅ SVG文件路径错误 (`home.html`)
- ✅ Home页面Currency逻辑不一致
- ✅ Transaction页面日期时间时区问题
- ✅ 导航栏图标化改造
- ✅ 交易卡片布局调整
- ✅ Edit按钮功能实现
- ✅ Ledger筛选器默认值优化 (`home.html`, `analysis.html`)
- ✅ 移动设备报销时间格式错误 (`home.html`) - 重要提醒！

### 5. SVG文件相关问题
- **问题**: SVG文件加载失败（如undo.svg报错）
- **可能原因**: 
  - 浏览器缓存问题
  - 网络请求被阻止
  - 文件路径错误
- **解决方案**:
  1. 清除浏览器缓存
  2. 检查网络请求状态
  3. 验证文件路径：`assets/svg/undo.svg`
  4. 使用测试页面：`test_svg.html`
- **测试方法**: 访问 http://localhost:8000/tests/test_svg.html

详细问题清单请参考：`docs/ISSUES_CHECKLIST.md`

## 测试和调试

### 1. 本地运行
```bash
python3 -m http.server 8000
```

### 2. 时区测试
使用 `test_timezone.html` 页面测试时区处理功能

### 3. 功能测试
- `tests/test_basic.html` - 基本功能测试
- `tests/test_category_icon.html` - Category Icon功能测试
- `tests/test_timezone.html` - 时区处理测试
- `tests/test_timezone_manager.html` - 时区管理器测试
- `tests/test_svg.html` - SVG文件加载测试
- `tests/test_ledger_default.html` - Ledger默认值测试
- `tests/test_reimbursement_time_fix.html` - 报销时间格式测试

### 4. 调试技巧
- 使用浏览器开发者工具
- 检查控制台错误信息
- 验证时区管理器初始化
- 参考 `docs/ISSUES_CHECKLIST.md` 中的常见问题

## 部署注意事项

- 所有页面需要通过HTTPS或localhost访问（Supabase要求）
- 确保Supabase项目配置正确
- 检查Google OAuth重定向URL设置
- 生产环境已部署到 https://money-tracker-2025.netlify.app
- 详细部署配置请参考：`config/deploy-config.md`

## 开发提醒

**重要**: 每次开发新功能时，请：
1. 参考现有代码实现方式
2. 遵循时区处理指南
3. 使用Supabase而不是本地数据库
4. 确保包含所有必需字段
5. 测试时区处理功能
6. 参考 `docs/ISSUES_CHECKLIST.md` 避免重复问题
7. 遵循项目的UI/UX设计规范

### ⚠️ 时间格式处理重要提醒

**绝对禁止使用以下时间格式**：
```javascript
// ❌ 错误 - 会导致移动设备兼容性问题
new Date().toLocaleString('en-CA').replace(',', '') + ':00'
```

**必须使用标准ISO格式**：
```javascript
// ✅ 正确 - 跨平台兼容
new Date().toISOString()
```

**原因**：
- `toLocaleString()` 在不同设备上产生不同格式
- 移动设备可能产生 `"2025-08-28 12:00:36 PM:00"` 等错误格式
- 手动拼接时间字符串容易出错
- Supabase数据库要求标准ISO 8601格式

**相关文档**：
- 详细修复说明：`docs/REIMBURSEMENT_TIME_FIX.md`
- 测试页面：`tests/test_reimbursement_time_fix.html`

## 特殊功能说明

### Category Icon 智能推荐
- 功能说明：`docs/CATEGORY_ICON_README.md`
- 自动推荐基于名称的emoji和背景色
- 支持手动调整和实时预览
- 在交易列表中显示category icon

### 报销功能时间处理
- 修复说明：`docs/REIMBURSEMENT_TIME_FIX.md`
- 使用标准ISO格式避免移动设备兼容性问题
- 测试页面：`tests/test_reimbursement_time_fix.html`
- **重要提醒**：所有时间字段必须使用 `toISOString()` 格式

---

## 🚀 快速开始

在每次新的 Cursor Chat 中，只需要说：

> **"请阅读 CURSOR_AI_GUIDE.md 文件，了解项目架构和开发规范，然后帮我实现新功能。"**

或者简单地说：

> **"请参考 CURSOR_AI_GUIDE.md 进行开发。"**

---

**此文档专为 Cursor AI 设计，包含项目开发所需的所有关键信息。**
