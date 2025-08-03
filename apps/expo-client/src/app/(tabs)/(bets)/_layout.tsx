import { BetCompetitionsContainer, UserBetsContainer } from '@/components/Bets'
import { useAnimatedScroll } from '@/hooks/useAnimatedScroll'
import { CollapsibleHeader, ScreenWrapper } from '@/ui'
import { TopTabs } from '@/ui/Components'

const BetsLayout = () => {
  const { onScroll } = useAnimatedScroll()

  const routes = [
    { key: 'screen1', title: 'User Bets' },
    { key: 'screen2', title: 'Bet Competitions' },
  ]

  return (
    <ScreenWrapper>
      {({ scrollOffsetY }) => (
        <>
          <CollapsibleHeader title='Bets' scrollOffsetY={scrollOffsetY} />

          <TopTabs
            routes={routes}
            screens={{
              screen1: () => <UserBetsContainer onScroll={onScroll(scrollOffsetY)} />,
              screen2: () => <BetCompetitionsContainer />,
            }}
          />
        </>
      )}
    </ScreenWrapper>
  )
}

export default BetsLayout
