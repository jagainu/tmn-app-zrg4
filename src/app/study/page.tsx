'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Play, RotateCcw, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react'
import { Word } from '@/types/word'
import { getWords } from '@/lib/storage'

type StudyMode = 'word-to-meaning' | 'meaning-to-word'
type StudyResult = 'correct' | 'incorrect' | null

export default function StudyPage() {
  const [words, setWords] = useState<Word[]>([])
  const [filteredWords, setFilteredWords] = useState<Word[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [studyMode, setStudyMode] = useState<StudyMode>('word-to-meaning')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isStudyStarted, setIsStudyStarted] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [studyResult, setStudyResult] = useState<StudyResult>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadWords = () => {
      const loadedWords = getWords()
      setWords(loadedWords)
      setFilteredWords(loadedWords)
      setIsLoading(false)
    }
    loadWords()
  }, [])

  useEffect(() => {
    let filtered = words

    // 言語フィルタ
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(word => word.language === selectedLanguage)
    }

    // カテゴリフィルタ
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(word => word.category === selectedCategory)
    }

    // シャッフル
    const shuffled = [...filtered].sort(() => Math.random() - 0.5)
    setFilteredWords(shuffled)
    setCurrentWordIndex(0)
    
    // 学習中の場合はリセット
    if (isStudyStarted) {
      handleRestart()
    }
  }, [words, selectedLanguage, selectedCategory])

  const getUniqueLanguages = () => {
    return Array.from(new Set(words.map(word => word.language)))
  }

  const getUniqueCategories = () => {
    return Array.from(new Set(words.map(word => word.category).filter(Boolean)))
  }

  const getCurrentWord = () => {
    return filteredWords[currentWordIndex]
  }

  const handleStartStudy = () => {
    if (filteredWords.length === 0) return
    setIsStudyStarted(true)
    setCurrentWordIndex(0)
    setShowAnswer(false)
    setStudyResult(null)
    setScore({ correct: 0, total: 0 })
  }

  const handleShowAnswer = () => {
    setShowAnswer(true)
  }

  const handleAnswerResponse = (isCorrect: boolean) => {
    const result = isCorrect ? 'correct' : 'incorrect'
    setStudyResult(result)
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }))
  }

  const handleNextWord = () => {
    if (currentWordIndex < filteredWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1)
      setShowAnswer(false)
      setStudyResult(null)
    } else {
      // 学習完了
      setIsStudyStarted(false)
    }
  }

  const handleRestart = () => {
    setIsStudyStarted(false)
    setCurrentWordIndex(0)
    setShowAnswer(false)
    setStudyResult(null)
    setScore({ correct: 0, total: 0 })
    // 再シャッフル
    const shuffled = [...filteredWords].sort(() => Math.random() - 0.5)
    setFilteredWords(shuffled)
  }

  const getQuestion = () => {
    const word = getCurrentWord()
    if (!word) return ''
    return studyMode === 'word-to-meaning' ? word.word : word.meaning
  }

  const getAnswer = () => {
    const word = getCurrentWord()
    if (!word) return ''
    return studyMode === 'word-to-meaning' ? word.meaning : word.word
  }

  const getQuestionLabel = () => {
    return studyMode === 'word-to-meaning' ? '単語' : '意味'
  }

  const getAnswerLabel = () => {
    return studyMode === 'word-to-meaning' ? '意味' : '単語'
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-64 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  if (!isStudyStarted) {
    return (
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">学習モード</h1>
        </div>

        {/* 学習完了の場合 */}
        {score.total > 0 && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">学習完了！</CardTitle>
              <CardDescription className="text-green-700">
                お疲れ様でした。学習結果をご確認ください。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-800">{score.total}</div>
                  <p className="text-sm text-green-700">出題数</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-800">{score.correct}</div>
                  <p className="text-sm text-green-700">正解数</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-800">
                    {Math.round((score.correct / score.total) * 100)}%
                  </div>
                  <p className="text-sm text-green-700">正解率</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 設定 */}
        <div className="max-w-2xl space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>学習設定</CardTitle>
              <CardDescription>
                学習したい単語の条件と出題形式を選択してください
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 学習モード */}
              <div className="space-y-2">
                <label className="text-sm font-medium">出題形式</label>
                <Select value={studyMode} onValueChange={(value: StudyMode) => setStudyMode(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="word-to-meaning">単語 → 意味</SelectItem>
                    <SelectItem value="meaning-to-word">意味 → 単語</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 言語フィルタ */}
              <div className="space-y-2">
                <label className="text-sm font-medium">言語</label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべての言語</SelectItem>
                    {getUniqueLanguages().map(language => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* カテゴリフィルタ */}
              <div className="space-y-2">
                <label className="text-sm font-medium">カテゴリ</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべてのカテゴリ</SelectItem>
                    {getUniqueCategories().map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 学習開始 */}
          <Card>
            <CardContent className="p-6">
              {filteredWords.length === 0 ? (
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    学習する単語がありません。
                  </p>
                  <Link href="/add-word">
                    <Button>
                      単語を追加する
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div>
                    <p className="text-lg font-medium mb-2">
                      {filteredWords.length}個の単語で学習を開始します
                    </p>
                    <p className="text-sm text-muted-foreground">
                      出題形式: {studyMode === 'word-to-meaning' ? '単語 → 意味' : '意味 → 単語'}
                    </p>
                  </div>
                  <Button onClick={handleStartStudy} size="lg">
                    <Play className="h-4 w-4 mr-2" />
                    学習を開始する
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentWord = getCurrentWord()
  if (!currentWord) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleRestart}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">学習中</h1>
        </div>
        <Button variant="outline" onClick={handleRestart}>
          <RotateCcw className="h-4 w-4 mr-2" />
          やり直す
        </Button>
      </div>

      {/* 進捗 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {currentWordIndex + 1} / {filteredWords.length}
            </div>
            <div className="text-sm text-muted-foreground">
              正解率: {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
              ({score.correct}/{score.total})
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${((currentWordIndex + 1) / filteredWords.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* 問題カード */}
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="space-y-2">
              <Badge variant="secondary">{currentWord.language}</Badge>
              {currentWord.category && (
                <Badge variant="outline">{currentWord.category}</Badge>
              )}
            </div>
            <CardTitle className="text-sm text-muted-foreground">
              {getQuestionLabel()}
            </CardTitle>
            <div className="text-3xl font-bold py-4">
              {getQuestion()}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 答えの表示 */}
            {showAnswer && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">{getAnswerLabel()}</div>
                <div className="text-2xl font-semibold text-primary p-4 bg-muted/50 rounded-lg">
                  {getAnswer()}
                </div>
              </div>
            )}

            {/* ボタン */}
            {!showAnswer ? (
              <Button onClick={handleShowAnswer} size="lg">
                <Eye className="h-4 w-4 mr-2" />
                答えを見る
              </Button>
            ) : (
              <div className="space-y-4">
                {studyResult === null && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">答えはあっていましたか？</p>
                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={() => handleAnswerResponse(true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        正解
                      </Button>
                      <Button
                        onClick={() => handleAnswerResponse(false)}
                        variant="destructive"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        不正解
                      </Button>
                    </div>
                  </div>
                )}

                {studyResult !== null && (
                  <div className="space-y-3">
                    <div className={`text-lg font-medium ${
                      studyResult === 'correct' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {studyResult === 'correct' ? '✅ 正解！' : '❌ 不正解'}
                    </div>
                    <Button onClick={handleNextWord} size="lg">
                      {currentWordIndex < filteredWords.length - 1 ? '次の問題' : '学習を終了'}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}