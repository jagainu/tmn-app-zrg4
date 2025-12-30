'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save } from 'lucide-react'
import { getWord, updateWordDirect } from '@/lib/storage'
import { Word } from '@/types/word'

const COMMON_LANGUAGES = ['英語', '日本語', '中国語', '韓国語', 'フランス語', 'ドイツ語', 'スペイン語']
const COMMON_CATEGORIES = ['ビジネス', '日常会話', '学術', '旅行', 'IT・技術', '医療', '法律', 'その他']

interface EditWordPageProps {
  params: {
    id: string
  }
}

export default function EditWordPage({ params }: EditWordPageProps) {
  const router = useRouter()
  const [word, setWord] = useState<Word | null>(null)
  const [formData, setFormData] = useState({
    word: '',
    meaning: '',
    language: '',
    category: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const loadWord = () => {
      const foundWord = getWord(params.id)
      if (foundWord) {
        setWord(foundWord)
        setFormData({
          word: foundWord.word,
          meaning: foundWord.meaning,
          language: foundWord.language,
          category: foundWord.category || ''
        })
      }
      setIsLoading(false)
    }
    loadWord()
  }, [params.id])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.word.trim()) {
      newErrors.word = '単語を入力してください'
    }

    if (!formData.meaning.trim()) {
      newErrors.meaning = '意味を入力してください'
    }

    if (!formData.language) {
      newErrors.language = '言語を選択してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !word) {
      return
    }

    setIsSubmitting(true)

    try {
      const updatedWord: Word = {
        ...word,
        word: formData.word.trim(),
        meaning: formData.meaning.trim(),
        language: formData.language,
        category: formData.category || ''
      }

      updateWordDirect(updatedWord)
      router.push('/words')
    } catch (error) {
      console.error('Failed to update word:', error)
      setErrors({ submit: '単語の更新に失敗しました。もう一度お試しください。' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-6 w-6 bg-muted rounded animate-pulse" />
          <div className="h-8 w-32 bg-muted rounded animate-pulse" />
        </div>
        <div className="max-w-2xl">
          <div className="h-64 bg-muted rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (!word) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/words">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">単語が見つかりません</h1>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              指定された単語が見つかりませんでした。
            </p>
            <Link href="/words">
              <Button>単語リストに戻る</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center gap-4">
        <Link href="/words">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">単語を編集</h1>
      </div>

      {/* フォーム */}
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>「{word.word}」を編集</CardTitle>
            <CardDescription>
              単語の情報を更新してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 単語 */}
              <div className="space-y-2">
                <Label htmlFor="word">単語 *</Label>
                <Input
                  id="word"
                  placeholder="例: apple"
                  value={formData.word}
                  onChange={(e) => handleInputChange('word', e.target.value)}
                  className={errors.word ? 'border-destructive' : ''}
                />
                {errors.word && (
                  <p className="text-sm text-destructive">{errors.word}</p>
                )}
              </div>

              {/* 意味 */}
              <div className="space-y-2">
                <Label htmlFor="meaning">意味 *</Label>
                <Input
                  id="meaning"
                  placeholder="例: りんご"
                  value={formData.meaning}
                  onChange={(e) => handleInputChange('meaning', e.target.value)}
                  className={errors.meaning ? 'border-destructive' : ''}
                />
                {errors.meaning && (
                  <p className="text-sm text-destructive">{errors.meaning}</p>
                )}
              </div>

              {/* 言語 */}
              <div className="space-y-2">
                <Label htmlFor="language">言語 *</Label>
                <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                  <SelectTrigger className={errors.language ? 'border-destructive' : ''}>
                    <SelectValue placeholder="言語を選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMON_LANGUAGES.map(language => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.language && (
                  <p className="text-sm text-destructive">{errors.language}</p>
                )}
              </div>

              {/* カテゴリ */}
              <div className="space-y-2">
                <Label htmlFor="category">カテゴリ（任意）</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="カテゴリを選択してください（任意）" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMON_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* エラーメッセージ */}
              {errors.submit && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive rounded">
                  {errors.submit}
                </div>
              )}

              {/* ボタン */}
              <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? '更新中...' : '更新する'}
                </Button>
                <Link href="/words">
                  <Button type="button" variant="outline">
                    キャンセル
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}