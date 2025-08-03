import { CreateBetCompetition } from '@/components/Bet-Competition'
import { CollapsibleHeader, ScreenWrapper } from '@/ui'

const CreateBetCompetitionScreen = () => {
  return (
    <ScreenWrapper>
      {({ scrollOffsetY }) => (
        <>
          <CollapsibleHeader
            showBackButton
            title='Create Bet Competition'
            scrollOffsetY={scrollOffsetY}
          />

          <CreateBetCompetition />
        </>
      )}
    </ScreenWrapper>
  )
}

export default CreateBetCompetitionScreen
