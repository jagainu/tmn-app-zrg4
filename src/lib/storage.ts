import { Word } from '@/types/word'

const STORAGE_KEY = 'vocabulary-words'

export function getWords(): Word[] {
  if (typeof window === 'undefined') {
    return []
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return []
    }
    
    const words = JSON.parse(stored)
    return Array.isArray(words) ? words : []
  } catch (error) {
    console.error('Failed to load words from storage:', error)
    return []
  }
}

export function saveWords(words: Word[]): void {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words))
  } catch (error) {
    console.error('Failed to save words to storage:', error)
  }
}

export function addWord(wordData: Omit<Word, 'id'>): Word {
  const newWord: Word = {
    ...wordData,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  const words = getWords()
  words.push(newWord)
  saveWords(words)
  
  return newWord
}

export function updateWord(id: string, wordData: Partial<Omit<Word, 'id'>>): Word | null {
  const words = getWords()
  const index = words.findIndex(w => w.id === id)
  
  if (index === -1) {
    return null
  }
  
  const updatedWord = {
    ...words[index],
    ...wordData,
    updatedAt: new Date()
  }
  
  words[index] = updatedWord
  saveWords(words)
  
  return updatedWord
}

// updateWord関数の別バージョン（Wordオブジェクトを直接受け取る）
export function updateWordDirect(updatedWord: Word): Word | null {
  const words = getWords()
  const index = words.findIndex(w => w.id === updatedWord.id)
  
  if (index === -1) {
    return null
  }
  
  const finalWord = {
    ...updatedWord,
    updatedAt: new Date()
  }
  
  words[index] = finalWord
  saveWords(words)
  
  return finalWord
}

export function deleteWord(id: string): boolean {
  const words = getWords()
  const filteredWords = words.filter(w => w.id !== id)
  
  if (filteredWords.length === words.length) {
    return false
  }
  
  saveWords(filteredWords)
  return true
}

export function getWordById(id: string): Word | null {
  const words = getWords()
  return words.find(w => w.id === id) || null
}

// getWord関数を追加（getWordByIdのエイリアス）
export function getWord(id: string): Word | null {
  return getWordById(id)
}