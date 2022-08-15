import { createContext } from 'react'

const NavContext = createContext<{
  currentNav: string
  setCurrentNav: (nav: string) => void
}>({ currentNav: 'home', setCurrentNav: () => null })

export default NavContext
