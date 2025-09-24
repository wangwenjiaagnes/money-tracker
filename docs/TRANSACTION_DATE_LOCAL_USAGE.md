# transaction_date_local 字段使用场景详解

## 字段概述

`transaction_date_local` 是一个用于存储交易本地时间的字段，格式为 `YYYY-MM-DD HH:MM:SS`（不带时区）。

## 使用场景

### 1. 交易编辑页面 (transaction.html)

#### 1.1 编辑现有交易时加载时间
**位置**: `loadEditTransactionData()` 函数
**用途**: 当用户编辑现有交易时，从数据库加载交易时间并显示在表单中
**逻辑**: 
- 优先使用 `transaction_date_local` 字段
- 如果没有，则使用 `transaction_date` 字段（向后兼容）
- 将时间格式化为 `YYYY-MM-DDTHH:MM` 格式显示在 datetime-local 输入框中

```javascript
if (transaction.transaction_date_local) {
    // 如果有本地时间字段，直接使用（不带时区）
    const localDateTime = transaction.transaction_date_local;
    transactionDate = new Date(localDateTime + 'Z'); // 添加Z表示UTC，避免时区转换
} else {
    // 否则使用UTC时间（向后兼容）
    transactionDate = new Date(transaction.transaction_date);
}
```

#### 1.2 保存新交易时存储时间
**位置**: 表单提交处理
**用途**: 当用户创建或更新交易时，将用户输入的时间保存到数据库
**逻辑**: 生成不带时区的本地时间格式存储到 `transaction_date_local` 字段

```javascript
const localDateTimeString = `${localYear}-${localMonth}-${localDay} ${localHours}:${localMinutes}:${localSeconds}`;
transactionData.transaction_date_local = localDateTimeString;
```

### 2. 主页 (home.html)

#### 2.1 按日期分组交易
**位置**: `groupTransactionsByDate()` 函数
**用途**: 将交易按日期分组显示，确保同一天的不同时间交易被正确分组
**逻辑**: 
- 优先使用 `transaction_date_local` 字段
- 如果没有，则使用 `transaction_date` 字段
- 如果没有，则使用 `created_at` 字段

```javascript
let dateString = transaction.transaction_date_local || transaction.transaction_date || transaction.created_at;
```

#### 2.2 格式化日期显示
**位置**: `formatDate()` 函数
**用途**: 将日期格式化为用户友好的显示格式（如 "Today", "Yesterday", "Monday, August 25, 2025"）
**逻辑**: 正确处理不同格式的日期字符串

### 3. 分析页面 (analysis.html)

#### 3.1 月度数据统计
**位置**: `getMonthlyData()` 函数
**用途**: 按月份统计交易数据，生成月度收支图表
**逻辑**: 使用本地时间确保数据按正确的月份分组

#### 3.2 每日数据统计
**位置**: `getDailyData()` 函数
**用途**: 按天统计交易数据，生成每日收支图表
**逻辑**: 使用本地时间确保数据按正确的日期分组

#### 3.3 交易排序
**位置**: 交易列表排序逻辑
**用途**: 按时间对交易进行排序（最新的在前）
**逻辑**: 优先使用本地时间进行排序

#### 3.4 交易详情显示
**位置**: `renderTransactionsPanel()` 函数
**用途**: 在分析页面的交易列表中显示交易日期
**逻辑**: 将日期格式化为简短格式（如 "Aug 25"）

### 4. 测试页面 (test_timezone.html)

#### 4.1 时区功能测试
**位置**: 各种测试函数
**用途**: 验证时区处理逻辑是否正确
**逻辑**: 测试不同格式的时间字符串处理

#### 4.2 创建测试交易
**位置**: `createTestTransaction()` 函数
**用途**: 创建测试交易来验证时区功能
**逻辑**: 使用新的本地时间格式创建测试数据

## 字段优先级

在所有使用场景中，`transaction_date_local` 字段都有最高优先级：

```javascript
// 标准优先级顺序
transaction.transaction_date_local || transaction.transaction_date || transaction.created_at
```

## 格式处理

### 支持的输入格式
1. **ISO格式**: `2025-08-20T13:52:00+00:00`
2. **本地时间格式**: `2025-08-20 13:52:00` (新格式)
3. **只有日期**: `2025-08-20`

### 处理逻辑
```javascript
if (dateString.includes('T')) {
    // ISO格式，直接解析
    date = new Date(dateString);
} else if (dateString.includes(' ')) {
    // 本地时间格式，添加Z表示UTC
    date = new Date(dateString + 'Z');
} else {
    // 只有日期，添加时间部分
    date = new Date(dateString + 'T00:00:00');
}
```

## 时区处理策略

### 存储策略
- `transaction_date`: 存储UTC时间（用于系统内部处理）
- `transaction_date_local`: 存储本地时间（用于用户显示）

### 显示策略
- 优先使用 `transaction_date_local` 字段
- 避免额外的时区转换
- 确保显示的时间与用户输入的时间一致

## 向后兼容性

为了确保旧数据正常工作，代码中包含了向后兼容逻辑：
- 如果 `transaction_date_local` 不存在，使用 `transaction_date`
- 如果 `transaction_date` 也不存在，使用 `created_at`
- 支持多种时间格式的解析

## 总结

`transaction_date_local` 字段主要用于：
1. **用户界面显示** - 确保用户看到的时间与输入的时间一致
2. **数据分组** - 按正确的本地时间进行日期分组
3. **数据分析** - 确保分析结果基于正确的本地时间
4. **时区一致性** - 避免时区转换导致的显示错误

这个字段解决了原始时区处理问题，确保应用在不同时区的用户都能看到正确的时间。
