import { GlobalBetCompetitions } from '@/components/Bet-Competition'
import { CollapsibleHeader, ScreenWrapper } from '@/ui'

const GlobalBetCompetitionsScreen = () => {
  return (
    <ScreenWrapper>
      {({ scrollOffsetY }) => (
        <>
          <CollapsibleHeader
            showBackButton
            title='Global Bet Competitions'
            scrollOffsetY={scrollOffsetY}
          />
          <GlobalBetCompetitions />
        </>
      )}
    </ScreenWrapper>
  )
}

export default GlobalBetCompetitionsScreen
