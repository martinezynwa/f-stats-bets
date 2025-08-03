import { JoinedBetCompetitions } from '@/components/Bet-Competition'
import { CollapsibleHeader, ScreenWrapper } from '@/ui'

const JoinedBetCompetitionsScreen = () => {
  return (
    <ScreenWrapper>
      {({ scrollOffsetY }) => (
        <>
          <CollapsibleHeader
            showBackButton
            title='Joined Bet Competitions'
            scrollOffsetY={scrollOffsetY}
          />

          <JoinedBetCompetitions />
        </>
      )}
    </ScreenWrapper>
  )
}

export default JoinedBetCompetitionsScreen
