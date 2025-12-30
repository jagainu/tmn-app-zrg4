import { Word } from '@/types/word'

const STORAGE_KEY = 'tmn-wordbook-words'

// Generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

// Get all words
export function getWords(): Word[] {
  if (typeof window === 'undefined') {
    return []
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to load words from localStorage:', error)
    return []
  }
}

// Get a single word by ID
export function getWord(id: string): Word | null {
  const words = getWords()
  return words.find(word => word.id === id) || null
}

// Add a new word
export function addWord(wordData: Omit<Word, 'id'>): Word {
  const newWord: Word = {
    ...wordData,
    id: generateId()
  }
  
  const words = getWords()
  const updatedWords = [...words, newWord]
  
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWords))
    } catch (error) {
      console.error('Failed to save words to localStorage:', error)
      throw new Error('Failed to save word')
    }
  }
  
  return newWord
}

// Update an existing word
export function updateWord(updatedWord: Word): Word {
  const words = getWords()
  const index = words.findIndex(word => word.id === updatedWord.id)
  
  if (index === -1) {
    throw new Error('Word not found')
  }
  
  words[index] = updatedWord
  
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(words))
    } catch (error) {
      console.error('Failed to update word in localStorage:', error)
      throw new Error('Failed to update word')
    }
  }
  
  return updatedWord
}

// Delete a word
export function deleteWord(id: string): boolean {
  const words = getWords()
  const filteredWords = words.filter(word => word.id !== id)
  
  if (filteredWords.length === words.length) {
    return false // Word not found
  }
  
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredWords))
    } catch (error) {
      console.error('Failed to delete word from localStorage:', error)
      throw new Error('Failed to delete word')
    }
  }
  
  return true
}