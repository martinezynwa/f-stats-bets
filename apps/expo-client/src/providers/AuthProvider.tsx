import { Session } from '@supabase/supabase-js'
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'

import { supabase } from '../lib/supabase'

type AuthData = {
  session: Session | null
  setSession: (session: Session | null) => void
  authLoading: boolean
}

const AuthContext = createContext<AuthData>({
  session: null,
  setSession: () => null,
  authLoading: true,
})

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession()

      setSession(sessionData.session)
      setAuthLoading(false)
    }

    fetchSession()
  }, [])

  return (
    <AuthContext.Provider value={{ session, setSession, authLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
