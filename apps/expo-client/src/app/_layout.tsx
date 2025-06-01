import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import React, { useEffect } from 'react'
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { NotifierWrapper } from 'react-native-notifier'

import { SignUpScreenComponent } from '@/components/Auth/SignUp'
import { NotVerified } from '@/components/User/NotVerified'
import { usePreloadAppData } from '@/hooks/usePreloadAppData'
import { usePreloadUserData } from '@/hooks/usePreloadUserData'
import '@/i18n'
import AuthProvider, { useAuth } from '@/providers/AuthProvider'
import QueryProvider from '@/providers/QueryProvider'
import { useUserDataStore } from '@/store'
import { Colors, HeaderBack } from '@/ui'

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryProvider>
  )
}

function AppContent() {
  const { session } = useAuth()
  const { user } = useUserDataStore()

  const {
    error: userDataError,
    initialLoaded: userDataLoaded,
    userNotFound,
  } = usePreloadUserData(!!session)

  const canPreloadAppData = userDataLoaded && !userDataError && !userNotFound
  const { error: appDataError, initialLoaded: appDataLoaded } = usePreloadAppData(canPreloadAppData)

  useEffect(() => {
    if (userDataError) throw userDataError
    if (appDataError) throw appDataError
  }, [appDataError, userDataError])

  const checkCompletelyLoaded = () => {
    if (userNotFound || !session) return true
    return appDataLoaded && userDataLoaded
  }

  const completelyLoaded = checkCompletelyLoaded()

  useEffect(() => {
    if (completelyLoaded) {
      SplashScreen.hideAsync()
    }
  }, [completelyLoaded])

  if (!completelyLoaded) return <Loading />
  if ((session && !!user && !user.isVerified) || (session && userNotFound)) return <NotVerified />
  if (userNotFound) return <SignUpScreenComponent />

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NotifierWrapper>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <NotifierWrapper>
            <BottomSheetModalProvider>
              <Stack
                screenOptions={{
                  headerShown: true,
                  headerLeft: ({ canGoBack }) => canGoBack && <HeaderBack />,
                  headerTitle: () => <></>,
                  headerStyle: {
                    backgroundColor: Colors.background,
                  },
                  headerShadowVisible: false,
                }}
              >
                <Stack.Screen name='(auth)' options={{ headerShown: false }} />
                <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
                <Stack.Screen name='modal' options={{ presentation: 'modal' }} />
              </Stack>
            </BottomSheetModalProvider>
          </NotifierWrapper>
        </KeyboardAvoidingView>
      </NotifierWrapper>
    </GestureHandlerRootView>
  )
}

const Loading = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: Colors.text }}>Loading...</Text>
  </View>
)
