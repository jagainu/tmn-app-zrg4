import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Plus, List, GraduationCap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary flex items-center justify-center gap-3">
          <BookOpen className="h-10 w-10" />
          単語帳アプリ
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          単語とその意味を登録して効率的に学習しましょう。
          あなた専用の単語帳で語彙力を向上させることができます。
        </p>
      </div>

      {/* 機能カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-500" />
              単語を追加
            </CardTitle>
            <CardDescription>
              新しい単語とその意味を登録します
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/add-word">
              <Button className="w-full">
                単語を追加する
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5 text-blue-500" />
              単語リスト
            </CardTitle>
            <CardDescription>
              登録済みの単語を確認・編集します
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/words">
              <Button variant="outline" className="w-full">
                単語リストを見る
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-purple-500" />
              学習モード
            </CardTitle>
            <CardDescription>
              登録した単語で学習を開始します
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/study">
              <Button variant="secondary" className="w-full">
                学習を始める
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* 特徴セクション */}
      <div className="bg-muted/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-center">アプリの特徴</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium">シンプルで使いやすい</h3>
              <p className="text-sm text-muted-foreground">
                直感的な操作で誰でも簡単に単語を管理できます
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium">ランダム学習</h3>
              <p className="text-sm text-muted-foreground">
                ランダムに出題される単語で効率的に学習できます
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium">カテゴリ分け</h3>
              <p className="text-sm text-muted-foreground">
                単語をカテゴリ別に整理して管理できます
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium">自己採点</h3>
              <p className="text-sm text-muted-foreground">
                学習の成果を自分で確認しながら進められます
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}