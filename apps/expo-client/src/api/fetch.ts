import { useToast } from '@/hooks/useToast'
import { supabase } from '@/lib/supabase'

export const useFetch = () => {
  const toast = useToast()

  const createQueryString = (
    params: Record<string, string | string[] | number | number[] | boolean | undefined>,
  ) => {
    const parts: string[] = []

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item =>
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`),
          )
        } else {
          parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        }
      }
    })

    return parts.join('&')
  }

  const handleFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const headers = {
      'Content-Type': 'application/json',
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      ...options.headers,
    }

    const url = `${process.env.EXPO_PUBLIC_API_URL}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers,
    }).catch(error => {
      console.error('FETCH ERROR', error)
      throw error
    })

    let responseData

    try {
      const text = await response.text()
      responseData = text ? JSON.parse(text) : null
    } catch (error) {
      console.error('JSON parse error:', error)
      throw error
    }

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

  return { handleFetch, createQueryString }
}
