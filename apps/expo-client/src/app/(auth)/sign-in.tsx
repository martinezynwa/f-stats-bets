import React from 'react'

import { SignInScreenComponent } from '@/components/Auth'
import { ScrollViewWrapper } from '@/ui'

const SignInScreen = () => {
  return (
    <ScrollViewWrapper>
      <SignInScreenComponent />
    </ScrollViewWrapper>
  )
}

export default SignInScreen
