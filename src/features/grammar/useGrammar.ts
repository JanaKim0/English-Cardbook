import { useContext } from 'react'
import { GrammarContext } from './grammar-context'

/** Доступ к конспектам по грамматике. */
export function useGrammar() {
  const value = useContext(GrammarContext)

  if (value === null) {
    throw new Error('useGrammar нужно вызывать внутри GrammarProvider')
  }

  return value
}
