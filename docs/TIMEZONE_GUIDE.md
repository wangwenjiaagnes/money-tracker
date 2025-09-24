# 时区处理指南

## 概述

本项目已建立完整的时区处理架构，所有新功能开发必须遵循以下规则，以确保时区处理的一致性。

## 核心原则

1. **查询数据库时使用UTC时间**
2. **显示给用户时使用本地时间**
3. **始终使用 TimezoneManager 类进行转换**

## 时区管理器 (TimezoneManager)

### 位置
`assets/js/timezoneManager.js`

### 主要方法

```javascript
// 转换UTC时间为本地时间显示
const localTime = window.timezoneManager.convertToLocalTime(utcTime);

// 获取本地时间字符串 (YYYY-MM-DD HH:mm:ss)
const localTimeString = window.timezoneManager.getLocalTimeString(utcTime);

// 转换本地日期范围为UTC范围（用于数据库查询）
const utcRange = await window.timezoneManager.getUTCDateRange(startDate, endDate);
// 返回: { utc_start: "2025-09-20T16:00:00+00:00", utc_end: "2025-09-21T15:59:59+00:00" }

// 获取用户时区
const userTimezone = window.timezoneManager.getUserTimezone();
```

## 数据库字段说明

- `transaction_date`: UTC时间 (TIMESTAMPTZ)
- `transaction_date_local`: 本地时间字符串 (TEXT, 格式: YYYY-MM-DD HH:mm:ss)

## 常见使用场景

### 1. 创建新交易
```javascript
const transactionData = {
    transaction_date: isoDateTime, // UTC时间
    transaction_date_local: window.timezoneManager.getLocalTimeString(isoDateTime), // 本地时间字符串
    created_at: new Date().toISOString(), // 必须包含此字段
    // ... 其他字段
};
```

### 2. 日期范围查询
```javascript
// 错误方式
query = query.gte('transaction_date', dateRange.value.start)
             .lte('transaction_date', dateRange.value.end);

// 正确方式
const utcRange = await window.timezoneManager.getUTCDateRange(dateRange.value.start, dateRange.value.end);
query = query.gte('transaction_date', utcRange.utc_start)
             .lte('transaction_date', utcRange.utc_end);
```

### 3. 日期显示
```javascript
// 错误方式
const dateOnly = localDate.toISOString().split('T')[0]; // 会导致时区偏移

// 正确方式
const year = localDate.getFullYear();
const month = String(localDate.getMonth() + 1).padStart(2, '0');
const day = String(localDate.getDate()).padStart(2, '0');
const dateOnly = `${year}-${month}-${day}`;
```

### 4. 日期比较
```javascript
// 使用时区管理器转换后进行比较
const localTimeString = window.timezoneManager.convertToLocalTime(transaction.transaction_date);
const localDate = new Date(localTimeString);
```

## 后端SQL函数

### get_utc_date_range
```sql
-- 在Supabase中运行此函数
CREATE OR REPLACE FUNCTION get_utc_date_range(
    p_start_date TEXT,
    p_end_date TEXT,
    p_timezone TEXT DEFAULT 'UTC'
)
RETURNS TABLE (
    utc_start TIMESTAMPTZ,
    utc_end TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ((p_start_date || ' 00:00:00')::TIMESTAMP AT TIME ZONE p_timezone AT TIME ZONE 'UTC')::TIMESTAMPTZ as utc_start,
        ((p_end_date || ' 23:59:59')::TIMESTAMP AT TIME ZONE p_timezone AT TIME ZONE 'UTC')::TIMESTAMPTZ as utc_end;
END;
$$ LANGUAGE plpgsql;
```

## 初始化要求

在每个HTML页面中，必须在使用时区管理器之前初始化：

```javascript
// 在supabase客户端创建后初始化
window.timezoneManager = new TimezoneManager(supabase);
```

## 常见错误

1. **忘记添加 created_at 字段** - 创建交易时必须包含此字段
2. **直接使用 toISOString().split('T')[0]** - 会导致时区偏移
3. **查询时直接使用本地日期字符串** - 必须转换为UTC时间范围
4. **忘记初始化 timezoneManager** - 会导致 "supabase.rpc is not a function" 错误

## 测试

使用 `test_timezone.html` 页面测试时区处理功能。

---

**重要提醒**: 所有新功能开发必须遵循此指南，确保时区处理的一致性。如有疑问，请参考现有代码中的实现方式。
