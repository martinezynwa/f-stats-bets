import { useTranslation } from '@/i18n/useTranslation'
import { HeaderLayout } from '@/ui'

const ProfileLayout = () => {
  const { t } = useTranslation()

  return (
    <HeaderLayout name='profile' headerTitle={t('profile.profile')} largeHeader headerTransparent />
  )
}

export default ProfileLayout
