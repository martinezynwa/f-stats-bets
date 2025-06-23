import BetCompetitionDetailsScreen from './id'
import BetCompetitionStandingsScreen from './standings'

import { useTranslation } from '@/i18n/useTranslation'
import { TabProps, TopTabs } from '@/ui/Components'

const BetCompetitionLayout = () => {
  const { t } = useTranslation()

  const tabs: TabProps[] = [
    {
      name: t('bets.betCompetition.tab.details'),
      component: BetCompetitionDetailsScreen,
    },
    {
      name: t('bets.betCompetition.tab.standings'),
      component: BetCompetitionStandingsScreen,
    },
  ]

  return <TopTabs tabs={tabs} />
}

export default BetCompetitionLayout
