# AI-DLC and Spec-Driven Development

Kiro-style Spec Driven Development implementation on AI-DLC (AI Development Life Cycle)

## Project Context

### Paths
- Steering: `{{KIRO_DIR}}/steering/`
- Specs: `{{KIRO_DIR}}/specs/`
- Commands: `.cursor/commands/`

### Steering vs Specification

**Steering**（`{{KIRO_DIR}}/steering/`）- 以專案層級的規則與情境引導 AI  
**Specs**（`{{KIRO_DIR}}/specs/`）- 將個別功能的開發流程正式化

### 啟用中的規格（Active Specifications）
- 檢查 `{{KIRO_DIR}}/specs/` 以查看啟用中的規格
- 使用 `/kiro:spec-status [feature-name]` 來查詢進度

## 開發指引（Development Guidelines）
- 以英文思考，但以繁體中文生成回應（Think in English, generate in Traditional Chinese）

## 工作流程（Workflow）

### Phase 0: Steering（選用）
`/kiro:steering` - 建立/更新 steering 文件  
`/kiro:steering-custom` - 為特定情境建立自訂 steering

備註：新功能或小改動可直接從 spec-init 開始。

### Phase 1: 建立規格（Specification Creation）
1. `/kiro:spec-init [detailed description]` - 以詳細的專案描述初始化規格
2. `/kiro:spec-requirements [feature]` - 產生需求文件（Requirements）
3. `/kiro:spec-design [feature]` - 互動式：「您已檢閱 requirements.md 了嗎？ [y/N]」
4. `/kiro:spec-tasks [feature]` - 互動式：確認 requirements/design 已審核

### Phase 2: 進度追蹤（Progress Tracking）
`/kiro:spec-status [feature]` - 檢視目前進度與階段

## 開發規則（Development Rules）
1. **考慮 steering**：重大開發前先執行 `/kiro:steering`（新功能可選）
2. **三階段審核流程**：Requirements → Design → Tasks → Implementation
3. **需要審核**：每個階段需人工審核（互動提示或手動）
4. **不得跳過階段**：Design 需基於已核准的 Requirements；Tasks 需基於已核准的 Design
5. **更新任務狀態**：開發中請即時更新任務完成情況
6. **保持 steering 最新**：重大變更後請執行 `/kiro:steering`
7. **檢查規格一致性**：使用 `/kiro:spec-status` 驗證一致性

## Steering 設定（Configuration）

### 目前的 Steering 檔案
由 `/kiro:steering` 指令管理。此處更新會反映於指令邏輯。

### 啟用的 Steering 檔案
- `product.md`：Always included - 產品脈絡與商業目標
- `tech.md`：Always included - 技術堆疊與架構決策
- `structure.md`：Always included - 檔案組織與程式碼樣式

### 自訂 Steering 檔案
<!-- Added by /kiro:steering-custom command -->
<!-- Format: 
- `filename.md`: Mode - Pattern(s) - Description
  Mode: Always|Conditional|Manual
  Pattern: File patterns for Conditional mode
-->

### 載入模式（Inclusion Modes）
- **Always**：每次互動皆載入（預設）
- **Conditional**：僅在特定檔案樣式時載入（例如："*.test.js"）
- **Manual**：以 `@filename.md` 明確引用