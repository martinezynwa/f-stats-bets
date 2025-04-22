import { Session } from '@supabase/supabase-js'
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'

import { supabase } from '../lib/supabase'

type AuthData = {
  session: Session | null
  authLoading: boolean
}

const AuthContext = createContext<AuthData>({
  session: null,
  authLoading: true,
})

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession()

      setAuthLoading(false)
      setSession(data.session)
    }

    fetchSession()

    // Listen for changes to the session
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return <AuthContext.Provider value={{ session, authLoading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
