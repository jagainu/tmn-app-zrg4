'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { ArrowLeft, Plus, Edit, Trash2, Search } from 'lucide-react'
import { Word } from '@/types/word'
import { getWords, deleteWord as removeWord } from '@/lib/storage'

export default function WordsPage() {
  const [words, setWords] = useState<Word[]>([])
  const [filteredWords, setFilteredWords] = useState<Word[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [wordToDelete, setWordToDelete] = useState<Word | null>(null)
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

    // 検索フィルタ
    if (searchTerm) {
      filtered = filtered.filter(
        word => 
          word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
          word.meaning.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 言語フィルタ
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(word => word.language === selectedLanguage)
    }

    // カテゴリフィルタ
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(word => word.category === selectedCategory)
    }

    setFilteredWords(filtered)
  }, [words, searchTerm, selectedLanguage, selectedCategory])

  const handleDeleteWord = (wordToRemove: Word) => {
    setWordToDelete(wordToRemove)
  }

  const handleConfirmDelete = () => {
    if (wordToDelete) {
      removeWord(wordToDelete.id)
      const updatedWords = words.filter(word => word.id !== wordToDelete.id)
      setWords(updatedWords)
      setWordToDelete(null)
    }
  }

  const getUniqueLanguages = () => {
    return Array.from(new Set(words.map(word => word.language)))
  }

  const getUniqueCategories = () => {
    return Array.from(new Set(words.map(word => word.category).filter((category): category is string => Boolean(category))))
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">単語リスト</h1>
        </div>
        <Link href="/add-word">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            単語を追加
          </Button>
        </Link>
      </div>

      {/* フィルタ・検索 */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="単語または意味で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="言語を選択" />
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
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="カテゴリを選択" />
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
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{words.length}</div>
            <p className="text-sm text-muted-foreground">総単語数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{filteredWords.length}</div>
            <p className="text-sm text-muted-foreground">表示中</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{getUniqueLanguages().length}</div>
            <p className="text-sm text-muted-foreground">言語数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{getUniqueCategories().length}</div>
            <p className="text-sm text-muted-foreground">カテゴリ数</p>
          </CardContent>
        </Card>
      </div>

      {/* 単語リスト */}
      {filteredWords.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              {words.length === 0 
                ? '単語が登録されていません。'
                : '該当する単語が見つかりませんでした。'}
            </p>
            <Link href="/add-word">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                最初の単語を追加
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWords.map(word => (
            <Card key={word.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{word.word}</CardTitle>
                    <p className="text-muted-foreground">{word.meaning}</p>
                  </div>
                  <div className="flex gap-1">
                    <Link href={`/edit-word/${word.id}`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteWord(word)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Badge variant="secondary">{word.language}</Badge>
                  {word.category && (
                    <Badge variant="outline">{word.category}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 削除確認ダイアログ */}
      <AlertDialog open={!!wordToDelete} onOpenChange={() => setWordToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>単語を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{wordToDelete?.word}」を削除します。この操作は元に戻せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}