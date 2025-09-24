# Money Tracker 项目文档

这个文件夹包含了 Money Tracker 记账软件的所有技术文档。

## 📋 文档列表

### 🔧 技术文档

#### 1. [TIMEZONE_FIX.md](./TIMEZONE_FIX.md)
**时区修复说明**
- 问题描述和解决方案
- 数据库层面修改说明
- 前端代码修改详情
- 测试验证方法
- 预期效果和注意事项

#### 2. [TRANSACTION_DATE_LOCAL_USAGE.md](./TRANSACTION_DATE_LOCAL_USAGE.md)
**transaction_date_local 字段使用场景详解**
- 字段概述和格式说明
- 详细使用场景分析
- 时区处理策略
- 向后兼容性说明
- 总结和最佳实践

#### 3. [TRANSACTION_DATE_USAGE.md](./TRANSACTION_DATE_USAGE.md)
**transaction_date 字段使用场景详解**
- 字段概述和格式说明
- 数据库查询优化
- 系统内部处理
- 向后兼容策略
- 与 transaction_date_local 的配合

#### 4. [CATEGORY_ICON_README.md](./CATEGORY_ICON_README.md)
**分类图标系统说明**
- 图标系统设计
- 使用方法
- 配置说明

## 🎯 文档用途

### 开发参考
- 了解系统架构和设计思路
- 理解时区处理机制
- 掌握数据库字段使用规范

### 维护指南
- 问题排查和修复方法
- 代码修改注意事项
- 测试验证流程

### 新功能开发
- 时区处理最佳实践
- 数据库字段使用规范
- 代码结构参考

## 📝 文档更新

当系统有重要更新时，请及时更新相关文档：

1. **功能变更**: 更新对应的使用场景文档
2. **问题修复**: 更新修复说明文档
3. **新增功能**: 创建新的文档或更新现有文档

## 🔍 快速查找

- **时区问题**: 查看 `TIMEZONE_FIX.md`
- **时间字段使用**: 查看 `TRANSACTION_DATE_*.md`
- **图标系统**: 查看 `CATEGORY_ICON_README.md`

---

*最后更新: 2025-08-25*
