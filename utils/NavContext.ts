import { createContext } from 'react'

const GlobalContext = createContext<{
  currentNav: string
  setCurrentNav: (nav: string) => void
}>({
  currentNav: 'home',
  setCurrentNav: () => null,
})

export default GlobalContext
