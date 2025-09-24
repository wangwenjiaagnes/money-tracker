# 数据库修复说明

## 🚨 问题描述

保存钱包时出现错误：
```
invalid input syntax for type integer: "77aeca19-6acd-489e-9542-e4a9a9c83c6a"
```

**根本原因：** `wallets` 表的 `owner_id` 字段是 `integer` 类型，但代码中传递的是 UUID 字符串。

## 🔧 解决方案

### 步骤 1：登录 Supabase 控制台

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择项目：`glduiypkpsuxzdjscuhq`
3. 进入 **SQL Editor**

### 步骤 2：执行数据库修复脚本

在 SQL Editor 中执行以下脚本：

```sql
-- 1. 检查当前表结构
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('wallets', 'allowed_users')
AND column_name IN ('id', 'owner_id')
ORDER BY table_name, column_name;

-- 2. 修复wallets表的owner_id字段类型
-- 将owner_id从integer改为uuid类型
ALTER TABLE wallets 
ALTER COLUMN owner_id TYPE uuid 
USING owner_id::text::uuid;

-- 3. 添加外键约束
ALTER TABLE wallets 
ADD CONSTRAINT fk_wallets_owner_id 
FOREIGN KEY (owner_id) 
REFERENCES allowed_users(id) 
ON DELETE SET NULL;

-- 4. 检查wallet_members表的user_id字段类型
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'wallet_members'
AND column_name = 'user_id';

-- 5. 如果wallet_members.user_id也是integer类型，也需要修复
-- ALTER TABLE wallet_members 
-- ALTER COLUMN user_id TYPE uuid 
-- USING user_id::text::uuid;

-- 6. 添加wallet_members的外键约束
-- ALTER TABLE wallet_members 
-- ADD CONSTRAINT fk_wallet_members_user_id 
-- FOREIGN KEY (user_id) 
-- REFERENCES allowed_users(id) 
-- ON DELETE CASCADE;

-- 7. 验证修复结果
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('wallets', 'allowed_users', 'wallet_members')
AND column_name IN ('id', 'owner_id', 'user_id')
ORDER BY table_name, column_name;
```

### 步骤 3：验证修复

执行完脚本后，检查结果：
- `wallets.owner_id` 应该是 `uuid` 类型
- `allowed_users.id` 应该是 `uuid` 类型
- 外键约束应该已创建

### 步骤 4：测试功能

1. 访问 http://localhost:8000/settings.html
2. 进入 Wallets 标签
3. 尝试创建新钱包
4. 应该不再出现类型错误

## ⚠️ 注意事项

1. **备份数据**：执行前建议备份相关表数据
2. **权限检查**：确保有足够的数据库权限
3. **测试环境**：建议先在测试环境验证

## 🔍 如果仍然失败

如果执行脚本后仍然出现错误，可能需要：

1. **检查现有数据**：确保 `wallets` 表中的 `owner_id` 值都是有效的 UUID
2. **清理无效数据**：删除或修复无效的 `owner_id` 值
3. **重新创建表**：如果数据不重要，可以考虑重新创建表

## 📞 需要帮助？

如果遇到问题，请提供：
1. 执行脚本时的错误信息
2. 表结构查询的结果
3. 具体的错误截图
