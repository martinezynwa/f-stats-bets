import { UserCreatedBetCompetitions } from '@/components/Bet-Competition'
import { CollapsibleHeader, ScreenWrapper } from '@/ui'

const UserCreatedBetCompetitionsScreen = () => {
  return (
    <ScreenWrapper>
      {({ scrollOffsetY }) => (
        <>
          <CollapsibleHeader
            showBackButton
            title='User Created Bet Competitions'
            scrollOffsetY={scrollOffsetY}
          />
          <UserCreatedBetCompetitions />
        </>
      )}
    </ScreenWrapper>
  )
}

export default UserCreatedBetCompetitionsScreen
