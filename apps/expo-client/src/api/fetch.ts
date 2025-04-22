import { useToast } from '@/hooks/useToast'
import { supabase } from '@/lib/supabase'

export const useFetch = () => {
  const toast = useToast()

  const handleFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
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

    const responseData = await response.json()

    if (!response.ok) {
      const status = response.status

      if (status === 400) {
        console.error('responseData', responseData[0])
        toast({
          title: JSON.stringify(responseData[0]),
        })
        throw new Error(JSON.stringify(responseData[0]))
      }

      if (status !== 401) {
        console.error('responseData', responseData)
        toast({
          title: responseData,
        })
        throw new Error(responseData)
      }
    }

    return responseData
  }

  return { handleFetch }
}
