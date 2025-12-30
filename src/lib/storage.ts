import { Word } from '@/types/word'

const STORAGE_KEY = 'words'

export function getWords(): Word[] {
  if (typeof window === 'undefined') return []
  
  try {
    const words = localStorage.getItem(STORAGE_KEY)
    return words ? JSON.parse(words) : []
  } catch {
    return []
  }
}

export function saveWords(words: Word[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words))
  } catch {
    console.error('Failed to save words to localStorage')
  }
}

export function addWord(word: Omit<Word, 'id'>): Word {
  const newWord: Word = {
    ...word,
    id: crypto.randomUUID()
  }
  
  const words = getWords()
  words.push(newWord)
  saveWords(words)
  
  return newWord
}

export function updateWord(id: string, updates: Partial<Omit<Word, 'id'>>): boolean {
  const words = getWords()
  const index = words.findIndex(word => word.id === id)
  
  if (index === -1) return false
  
  words[index] = { ...words[index], ...updates }
  saveWords(words)
  
  return true
}

export function deleteWord(id: string): boolean {
  const words = getWords()
  const filtered = words.filter(word => word.id !== id)
  
  if (filtered.length === words.length) return false
  
  saveWords(filtered)
  return true
}

export function getWordById(id: string): Word | undefined {
  const words = getWords()
  return words.find(word => word.id === id)
}