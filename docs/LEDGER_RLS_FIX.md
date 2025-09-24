# Ledger RLS 权限问题解决方案

## 问题描述
创建 ledger 时出现错误：`new row violates row-level security policy for table "ledgers"`

## 问题原因
Supabase 的 Row Level Security (RLS) 策略阻止了用户直接插入 `ledgers` 表。

## 解决方案

### 方案 1：修改 RLS 策略（推荐）
在 Supabase 控制台中执行以下 SQL：

```sql
-- 允许认证用户插入 ledgers 表
CREATE POLICY "Allow authenticated users to insert ledgers" ON "public"."ledgers"
FOR INSERT TO authenticated
WITH CHECK (true);

-- 允许用户查看自己创建的 ledgers
CREATE POLICY "Allow users to view their own ledgers" ON "public"."ledgers"
FOR SELECT TO authenticated
USING (true);

-- 允许用户更新自己创建的 ledgers
CREATE POLICY "Allow users to update their own ledgers" ON "public"."ledgers"
FOR UPDATE TO authenticated
USING (true);
```

### 方案 2：临时禁用 RLS
在 Supabase 控制台中：
1. 进入 Authentication > Policies
2. 找到 `ledgers` 表
3. 临时禁用 RLS
4. 创建 ledger
5. 重新启用 RLS

### 方案 3：使用管理员权限
使用 Supabase 的 service role key 来创建 ledger：

```javascript
// 在服务器端使用 service role key
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
```

## 当前状态
- ✅ 代码已修复，提供清晰的错误信息
- ✅ 自动添加创建者到 `ledger_members` 表
- ⚠️ 需要数据库管理员修改 RLS 策略

## 测试
1. 访问：http://localhost:8000/settings.html?section=ledger&action=create
2. 尝试创建 ledger
3. 查看错误信息（如果 RLS 策略未修改）

## 下一步
联系数据库管理员执行方案 1 中的 SQL 语句来修复 RLS 策略。
