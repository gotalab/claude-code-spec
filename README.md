# Claude Code Spec-Driven Development

> 🌐 **Language**  
> 📖 **[English Version](README_en.md)** | 📖 **日本語版 README** (このページ) | 📖 **[繁體中文說明](README_zh-TW.md)**


> [!Warning]
> 初期バージョンのため、使いながら適宜改善していく予定

📝 **関連記事**  
**[Kiroの仕様書駆動開発プロセスをClaude Codeで徹底的に再現した](https://zenn.dev/gotalab/articles/3db0621ce3d6d2)** - Zenn記事

Claude CodeのSlash CommandsとCLAUDE.mdを使用して、Kiro IDEに組み込まれているSpec-Driven Developmentを実践するためのプロジェクト。Kiroでの実際の仕様書駆動開発の流れをディレクトリ構成も含めてほぼそのまま再現している。

## 概要

このプロジェクトは、Claude CodeのSlash Commandsを活用して、仕様駆動開発（Spec-Driven Development）を効率的に行うためのツールセットを提供する。各開発フェーズで適切なコマンドを使用することで、体系的かつ品質の高い開発プロセスを実現できる。

## セットアップ

### CCSDD CLIツールのインストール

Claude Code Spec-Driven Developmentを使用するには、まずCCSDDコマンドラインツールをインストールします。

#### インストール

```bash
# このリポジトリをクローン
git clone https://github.com/gotalab/claude-code-spec.git
cd claude-code-spec

# CCSCDDをグローバルにインストール
npm install -g .
```

インストール後、どこからでも`ccsdd`コマンドが使用できるようになります：

```bash
# インストール確認
ccsdd --version

# 利用可能なコマンド一覧
ccsdd --help

# 使用例: ファイル存在確認
ccsdd check-file README.md

# 使用例: プロジェクトファイル一覧
ccsdd find-project-files

# 使用例: spec一覧表示
ccsdd list-all-specs
```

CCSCDDは`/kiro:*`コマンド内で自動的に呼び出されるため、通常は直接使用する必要はありません。

#### アンインストール

```bash
# CCSCDDをアンインストール
npm uninstall -g claude-code-spec
```

### 自分のプロジェクトに導入する

Claude Code Spec-Driven Developmentを自分のプロジェクトに導入するには、以下の2つのファイル/ディレクトリをコピーするだけ

1. **`.claude/commands/` ディレクトリ** - Slash Commandsの定義
2. **`CLAUDE.md` ファイル** - Claude Codeの設定とプロジェクト指示

### 初回セットアップ手順

1. **CCSCDDをインストール**（上記参照）
2. **ファイルをコピー**
3. **CLAUDE.mdをコピー**してプロジェクトに合わせて調整
4. **最初のコマンドを実行**:
   ```bash
   # オプション: ステアリング文書を作成
   /kiro:steering
   
   # 最初の機能仕様を作成
   /kiro:spec-init "あなたのプロジェクトの詳細な説明"
   ```

### 必要なディレクトリ構造

コマンドを実行すると、以下のディレクトリが自動的に作成される

```
あなたのプロジェクト/
├── .claude/
│   └── commands/          # コピーしたコマンド定義
├── .kiro/
│   ├── steering/          # 自動生成されるステアリング文書
│   └── specs/             # 自動生成される機能仕様
├── CLAUDE.md              # 言語別ファイル（例: CLAUDE_en.md, CLAUDE_zh-TW.md）からコピーしてリネーム
├── CLAUDE_en.md           # 英語版 Claude Code 設定
├── CLAUDE_zh-TW.md        # 繁体字中国語版 Claude Code 設定
├── README.md              # 日本語版 README
├── README_en.md           # 英語版 README
├── README_zh-TW.md        # 繁体字中国語版 README
└── （あなたのプロジェクトファイル）
```

## 使い方

### 1. 新規プロジェクトの場合

```bash
# オプション: プロジェクトステアリング生成（推奨だが必須ではない）
/kiro:steering

# ステップ1: 新機能の仕様作成開始（詳細な説明を含める）
/kiro:spec-init "ユーザーがPDFをアップロードして、その中の図表を抽出し、AIが内容を説明する機能を作りたい。技術スタックはNext.js、TypeScript、Tailwind CSSを使用。"

# ステップ2: 要件定義（自動生成されたfeature-nameを使用）
/kiro:spec-requirements pdf-diagram-extractor
# → .kiro/specs/pdf-diagram-extractor/requirements.md をレビュー・編集

# ステップ3: 技術設計（インタラクティブ承認）
/kiro:spec-design pdf-diagram-extractor
# → "requirements.mdをレビューしましたか？ [y/N]" に応答
# → .kiro/specs/pdf-diagram-extractor/design.md をレビュー・編集

# ステップ4: タスク生成（インタラクティブ承認）
/kiro:spec-tasks pdf-diagram-extractor
# → requirements と design のレビュー確認に応答
# → .kiro/specs/pdf-diagram-extractor/tasks.md をレビュー・編集

# ステップ5: 実装開始
```

### 2. 既存プロジェクトへの機能追加

```bash
# オプション: ステアリング作成・更新
# 新規作成の場合も、更新の場合も同じコマンドを使用
/kiro:steering

# ステップ1: 新機能の仕様作成開始
/kiro:spec-init "新しい機能の詳細な説明をここに記述"
# 以降は新規プロジェクトと同じ
```

### 3. 進捗確認

```bash
# 特定機能の進捗確認
/kiro:spec-status my-feature

# 現在のフェーズ、承認状況、タスク進捗が表示される
```

## Spec-Driven Development プロセス

### プロセスフロー図

このフローでは、各フェーズで「レビュー・承認」が必要となる。

**ステアリング文書**は、プロジェクトに関する永続的な知識（アーキテクチャ、技術スタック、コード規約など）を記録するドキュメントです。作成・更新はオプションだが、プロジェクトの長期的な保守性を高めるために推奨される。

```mermaid
graph TD
    A["プロジェクト開始"] --> B{"ステアリング<br/>文書化？"}
    B -->|はい| C["/kiro:steering"]
    B -->|いいえ| D["/kiro:spec-init"]
    C --> D
    
    D --> E["/kiro:spec-requirements"]
    E --> F["requirements.md"]
    F --> G{"満足？"}
    G -->|いいえ| G1["編集・修正"]
    G1 --> F
    G -->|はい| H["次フェーズへ"]
    
    H --> I["/kiro:spec-design"]
    I --> J["design.md"]
    J --> K{"満足？"}
    K -->|いいえ| K1["編集・修正"]
    K1 --> J
    K -->|はい| L["次フェーズへ"]
    
    L --> M["/kiro:spec-tasks"]
    M --> N["tasks.md"]
    N --> O{"満足？"}
    O -->|いいえ| O1["編集・修正"]
    O1 --> N
    O -->|はい| P["実装準備完了"]
    
    P --> Q["実装開始"]
    Q --> R["/kiro:spec-status"]
    R --> S{"完了？"}
    S -->|いいえ| Q
    S -->|はい| T["機能完成"]
    
    T --> U{"ステアリング<br/>更新？"}
    U -->|はい| V["/kiro:steering"]
    U -->|いいえ| W["完了"]
    V --> W
    
    %% スタイル定義
    style A fill:#f8f9fa,stroke:#495057
    style C fill:#495057,stroke:#343a40,color:#ffffff
    style D fill:#495057,stroke:#343a40,color:#ffffff
    style E fill:#495057,stroke:#343a40,color:#ffffff
    style I fill:#495057,stroke:#343a40,color:#ffffff
    style M fill:#495057,stroke:#343a40,color:#ffffff
    style R fill:#495057,stroke:#343a40,color:#ffffff
    style V fill:#495057,stroke:#343a40,color:#ffffff
    style F fill:#f8f9fa,stroke:#6c757d
    style J fill:#f8f9fa,stroke:#6c757d
    style N fill:#f8f9fa,stroke:#6c757d
    style H fill:#e8f5e9,stroke:#28a745
    style L fill:#e8f5e9,stroke:#28a745
    style P fill:#e8f5e9,stroke:#28a745
    style Q fill:#adb5bd,stroke:#495057
    style T fill:#6c757d,stroke:#495057,color:#ffffff
    style W fill:#6c757d,stroke:#495057,color:#ffffff
```

## スラッシュコマンド一覧

### 🚀 Phase 0: プロジェクトステアリング（オプション）

| コマンド | 用途 | 使用タイミング |
|---------|------|---------------|
| `/kiro:steering` | ステアリング文書のスマート作成・更新 | すべての場面（新規・更新どちらも） |
| `/kiro:steering-custom` | カスタムステアリング文書の作成 | 特殊な規約やガイドラインが必要な時 |

**注意**: ステアリング文書は推奨されるが必須ではない。小規模な機能追加や試験的な開発では省略可能。

#### ステアリング文書の種類
- **product.md**: プロダクト概要、機能、ユースケース
- **tech.md**: アーキテクチャ、技術スタック、開発環境
- **structure.md**: ディレクトリ構造、コード規約、命名規則
- **カスタム文書**: API規約、テスト方針、セキュリティポリシー等

### 📋 Phase 1: 仕様作成

| コマンド | 用途 | 使用タイミング |
|---------|------|---------------|
| `/kiro:spec-init [詳細なプロジェクト説明]` | プロジェクト説明から仕様構造を初期化 | 新機能開発開始時 |
| `/kiro:spec-requirements [feature-name]` | 要件定義書の生成 | 仕様初期化後すぐ |
| `/kiro:spec-design [feature-name]` | 技術設計書の生成 | 要件承認後 |
| `/kiro:spec-tasks [feature-name]` | 実装タスクの生成 | 設計承認後 |

### 📊 Phase 2: 進捗管理

| コマンド | 用途 | 使用タイミング |
|---------|------|---------------|
| `/kiro:spec-status [feature-name]` | 現在の進捗とフェーズ確認 | 開発中随時 |

## 3フェーズ承認ワークフロー

このシステムの核心は、各フェーズで人間によるレビューと承認を必須とする

```mermaid
sequenceDiagram
    participant D as Developer
    participant C as Claude Code
    participant H as Human Reviewer
    
    D->>C: "/kiro:spec-requirements feature"
    C->>C: "要件生成"
    C->>D: "requirements.md"
    D->>H: "レビュー依頼"
    H->>H: "レビュー・編集"
    
    D->>C: "/kiro:spec-design feature"
    C->>D: "レビュー確認: requirements.mdをレビューしましたか？"
    D->>C: "y"
    C->>C: "設計生成（要件ベース）"
    C->>D: "design.md"
    D->>H: "レビュー依頼"
    H->>H: "レビュー・編集"
    
    D->>C: "/kiro:spec-tasks feature"
    C->>D: "レビュー確認: requirements/design確認"
    D->>C: "y"
    C->>C: "タスク生成（設計ベース）"
    C->>D: "tasks.md"
    D->>H: "レビュー依頼"
    H->>H: "レビュー・編集"
    
    D->>C: "実装開始"
```

## ベストプラクティス

### ✅ 推奨事項

1. **常にステアリングから開始**
   - すべての場面で `/kiro:steering` を使用（スマートに新規作成・更新を判断）
   - 統合コマンドは既存ファイルを保護しつつ適切に処理

2. **フェーズを飛ばさない**
   - 要件 → 設計 → タスクの順序を厳守
   - 各フェーズで必ず人間によるレビューを実施

3. **定期的な進捗確認**
   - `/kiro:spec-status` で現在の状況を把握
   - タスクの完了状況を適切に更新

4. **ステアリングの保守**
   - 大きな変更後は `/kiro:steering` を実行（自動的に更新を判断）
   - プロジェクトの成長に合わせて更新

### ❌ 避けるべきこと

1. **承認なしでの次フェーズ移行**
   - プロンプトへの確認応答を忘れない

2. **ステアリング文書の放置**
   - 古い情報は開発の妨げになる

3. **タスクステータスの未更新**
   - 進捗が不明確になり管理が困難に

## プロジェクト構造

```
.
├── .claude/
│   └── commands/          # スラッシュコマンド定義
│       └── kiro/
│           ├── spec-init.md
│           ├── spec-requirements.md
│           ├── spec-design.md
│           ├── spec-tasks.md
│           ├── spec-status.md
│           ├── steering.md          # 統合ステアリングコマンド
│           └── steering-custom.md
├── .kiro/
│   ├── steering/          # ステアリング文書
│   │   ├── product.md
│   │   ├── tech.md
│   │   └── structure.md
│   └── specs/             # 機能仕様
│       └── [feature-name]/
│           ├── spec.json      # フェーズ承認状態
│           ├── requirements.md # 要件定義書
│           ├── design.md      # 技術設計書
│           └── tasks.md       # 実装タスク
├── CLAUDE.md              # メイン設定（下記いずれかの言語ファイルからコピー）
├── CLAUDE_en.md           # 英語版設定
├── CLAUDE_zh-TW.md        # 繁体字版設定
├── README.md              # 日本語版 README
├── README_en.md           # 英語版 README
├── README_zh-TW.md        # 繁体字版 README
└── （あなたのプロジェクトファイル）
```

## 自動化機能

Claude Codeのフック機能により以下が自動化されている

- タスク進捗の自動追跡
- 仕様遵守のチェック
- コンパクト時のコンテキスト保持
- ステアリングドリフトの検出

## トラブルシューティング

### コマンドが動作しない場合
1. `.claude/commands/` ディレクトリの存在を確認
2. コマンドファイルの命名規則を確認（`command-name.md`）
3. Claude Codeの最新バージョンを使用しているか確認

### 承認フローで詰まった場合
1. レビュー確認プロンプトに正しく応答しているか確認
2. 前フェーズの承認が完了しているか確認
3. `/kiro:spec-status` で現在の状態を診断
4. 必要に応じて `spec.json` を手動で確認・編集

## まとめ

Claude Codeのスラッシュコマンドを活用したSpec-Driven Developmentにより、以下が実現できる

- 📐 体系的な開発プロセス
- ✅ 品質保証のための段階的承認
- 📊 透明性の高い進捗管理
- 🔄 継続的なドキュメント更新
- 🤖 AIアシストによる効率化

このシステムを使用することで、開発の品質と効率を大幅に向上させることができる。