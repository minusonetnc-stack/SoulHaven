import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface SecureModeContextType {
  isSecure: boolean
  toggleSecure: () => void
  isTransitioning: boolean
}

const SecureModeContext = createContext<SecureModeContextType>({
  isSecure: false,
  toggleSecure: () => {},
  isTransitioning: false,
})

export function SecureModeProvider({ children }: { children: ReactNode }) {
  const [isSecure, setIsSecure] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const toggleSecure = useCallback(() => {
    setIsTransitioning(true)
    setIsSecure(prev => !prev)
    // Transition takes ~2 seconds
    setTimeout(() => setIsTransitioning(false), 2500)
  }, [])

  return (
    <SecureModeContext.Provider value={{ isSecure, toggleSecure, isTransitioning }}>
      {children}
    </SecureModeContext.Provider>
  )
}

export const useSecureMode = () => useContext(SecureModeContext)
