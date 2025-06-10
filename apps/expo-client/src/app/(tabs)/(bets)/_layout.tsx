import { useTranslation } from '@/i18n/useTranslation'
import { HeaderLayout } from '@/ui'

const BetsLayout = () => {
  const { t } = useTranslation()

  return <HeaderLayout name='bets' headerTitle={t('bets.bets')} largeHeader headerTransparent />
}

export default BetsLayout
