import { supabase } from '@/lib/supabase'

export const handleFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const headers = {
    'Content-Type': 'application/json',
    ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers,
  }).catch(error => {
    console.error('error', error)
    throw error
  })

  if (!response.ok) {
    if (response.status !== 401) {
      console.log('response', response)
      throw new Error(`API request failed: ${response.statusText}`)
    }
  }

  const data = await response.json()

  return data
}
