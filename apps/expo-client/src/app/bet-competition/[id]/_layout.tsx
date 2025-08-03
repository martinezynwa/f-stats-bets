import { BetCompetition, BetCompetitionStandings } from '@/components/Bet-Competition'
import { useAnimatedScroll } from '@/hooks/useAnimatedScroll'
import { useTranslation } from '@/i18n/useTranslation'
import { CollapsibleHeader, ScreenWrapper } from '@/ui'
import { TopTabs } from '@/ui/Components'

const BetCompetitionLayout = () => {
  const { t } = useTranslation()
  const { onScroll } = useAnimatedScroll()

  const routes = [
    { key: 'screen1', title: t('bets.betCompetition.tab.details') },
    { key: 'screen2', title: t('bets.betCompetition.tab.standings') },
  ]

  return (
    <ScreenWrapper>
      {({ scrollOffsetY }) => (
        <>
          <CollapsibleHeader showBackButton title='' scrollOffsetY={scrollOffsetY} />

          <TopTabs
            routes={routes}
            screens={{
              screen1: () => <BetCompetition onScroll={onScroll(scrollOffsetY)} />,
              screen2: () => <BetCompetitionStandings onScroll={onScroll(scrollOffsetY)} />,
            }}
          />
        </>
      )}
    </ScreenWrapper>
  )
}

export default BetCompetitionLayout
