import { UserData } from '@/components/User'
import { CollapsibleHeader, ScreenWrapper } from '@/ui'

export default function ProfileScreen() {
  return (
    <ScreenWrapper>
      {({ scrollOffsetY }) => (
        <>
          <CollapsibleHeader title='Profile' scrollOffsetY={scrollOffsetY} />
          <UserData />
        </>
      )}
    </ScreenWrapper>
  )
}
