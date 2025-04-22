import React from 'react'

import { SignInScreenComponent } from '@/components/Auth'
import { SafeAreaWrapper } from '@/ui'

const SignInScreen = () => {
  return (
    <SafeAreaWrapper>
      <SignInScreenComponent />
    </SafeAreaWrapper>
  )
}

export default SignInScreen
