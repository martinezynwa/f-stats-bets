import BetCompetitionsScreen from './bet-competitions'
import UserBetsScreen from './user-bets'

import { useTranslation } from '@/i18n/useTranslation'
import { TabProps, TopTabs } from '@/ui/Components'

const BetsLayout = () => {
  const { t } = useTranslation()

  const tabs: TabProps[] = [
    {
      name: t('bets.tab.userBets'),
      component: UserBetsScreen,
    },
    {
      name: t('bets.tab.betCompetitions'),
      component: BetCompetitionsScreen,
    },
  ]

  return <TopTabs tabs={tabs} />
}

export default BetsLayout
