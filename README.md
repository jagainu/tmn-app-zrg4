# tmn-app-zrg4

> **Status**: 🎨 DESIGNING

## 概要

ユーザーが単語とその意味を登録し、学習できる単語帳アプリケーション。単語の追加、編集、削除、学習モードを提供します。

## 機能

- [ ] 単語追加
- [ ] 単語編集
- [ ] 単語削除
- [ ] 単語リスト表示
- [ ] 学習モード
- [ ] ランダム出題
- [ ] 自己採点

## 画面

| パス | 画面名 | 説明 |
|------|--------|------|
| `/` | ホーム | アプリの概要と主要な機能へのナビゲーション |
| `/words` | 単語リスト | 登録されている単語の一覧と管理 |
| `/add-word` | 単語追加 | 新しい単語を追加するフォーム |
| `/edit-word/[id]` | 単語編集 | 既存の単語を編集するページ |
| `/study` | 学習モード | 登録した単語を使って学習するページ |

## データ

### Word

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | string | 単語の一意の識別子 |
| word | string | 学習する単語 |
| meaning | string | 単語の意味 |
| language | string | 単語の言語（英語、日本語など） |
| category | string | 単語のカテゴリ（任意） |

## 認証

なし

---

## Tech Stack

- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS + shadcn/ui
- Database: localStorage (ブラウザストレージ)
- Hosting: Vercel
