import React from 'react'

import { SignUpScreenComponent } from '@/components/Auth'
import { SafeAreaWrapper } from '@/ui'

const SignUpScreen = () => {
  return (
    <SafeAreaWrapper>
      <SignUpScreenComponent />
    </SafeAreaWrapper>
  )
}

export default SignUpScreen
