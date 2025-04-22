import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'

import { DB } from '@/types'
import 'react-native-url-polyfill/auto'

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key)
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value)
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key)
  },
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY as string

export const supabase = createClient<DB>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
