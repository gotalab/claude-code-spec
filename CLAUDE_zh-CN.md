# Claude Code 规范驱动开发

使用 Claude Code 的斜杠命令、钩子和代理实现的 Kiro 风格规范驱动开发。

## 项目上下文

### 路径
- 导向：`.kiro/steering/`
- 规范：`.kiro/specs/`
- 命令：`.claude/commands/`

### 导向与规范的区别

**导向** (`.kiro/steering/`) - 使用项目范围的规则和上下文指导 AI  
**规范** (`.kiro/specs/`) - 为各个功能规范化开发流程

### 活跃的规范
- 检查 `.kiro/specs/` 查看活跃的规范
- 使用 `/kiro:spec-status [feature-name]` 检查进度

## 开发指南
- 用英语思考，但用日语生成回复（思考は英語、回答の生成は日本語で行うように）

## 工作流程

### 阶段 0：导向（可选）
`/kiro:steering` - 创建/更新导向文档
`/kiro:steering-custom` - 为特殊上下文创建自定义导向

**注意**：对于新功能或小型添加是可选的。可以直接进入 spec-init。

### 阶段 1：规范创建
1. `/kiro:spec-init [详细描述]` - 使用详细的项目描述初始化规范
2. `/kiro:spec-requirements [feature]` - 生成需求文档
3. `/kiro:spec-design [feature]` - 交互式："您已审查 requirements.md 了吗？[y/N]"
4. `/kiro:spec-tasks [feature]` - 交互式：确认需求和设计审查

### 阶段 2：进度跟踪
`/kiro:spec-status [feature]` - 检查当前进度和阶段

## 开发规则
1. **考虑导向**：在主要开发之前运行 `/kiro:steering`（对新功能可选）
2. **遵循 3 阶段批准工作流程**：需求 → 设计 → 任务 → 实施
3. **需要批准**：每个阶段都需要人工审查（交互式提示或手动）
4. **不要跳过阶段**：设计需要已批准的需求；任务需要已批准的设计
5. **更新任务状态**：在处理任务时将其标记为已完成
6. **保持导向最新**：在重大更改后运行 `/kiro:steering`
7. **检查规范合规性**：使用 `/kiro:spec-status` 验证一致性

## 导向配置

### 当前导向文件
由 `/kiro:steering` 命令管理。此处的更新反映命令更改。

### 活跃的导向文件
- `product.md`：始终包含 - 产品上下文和业务目标
- `tech.md`：始终包含 - 技术栈和架构决策
- `structure.md`：始终包含 - 文件组织和代码模式

### 自定义导向文件
<!-- 由 /kiro:steering-custom 命令添加 -->
<!-- 格式：
- `filename.md`：模式 - 模式 - 描述
  模式：Always|Conditional|Manual
  模式：条件模式的文件模式
-->

### 包含模式
- **Always**：在每次交互中加载（默认）
- **Conditional**：为特定文件模式加载（例如：`"*.test.js"`）
- **Manual**：使用 `@filename.md` 语法引用