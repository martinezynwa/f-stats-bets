import { useTranslation } from '@/i18n/useTranslation'
import { HeaderLayout, HorizontalDatePicker } from '@/ui'

const HomeLayout = () => {
  const { t } = useTranslation()

  return (
    <HeaderLayout
      name='index'
      headerTitle={t('home.home')}
      headerComponent={<HorizontalDatePicker />}
    />
  )
}

export default HomeLayout
