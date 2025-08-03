import { usePathname } from 'expo-router'

import { Text } from '../Typography/Text'

import { useTranslation } from '@/i18n/useTranslation'
import { getPathTitle } from '@/lib/routes'

const getTextVariant = (fontSize: number) => {
  if (fontSize < 20) return 'xl'
  if (fontSize < 28) return 'lg'
  return 'md'
}

export const HeaderTitle = () => {
  const { t } = useTranslation()
  const path = usePathname()
  const { headerTitle } = getPathTitle(path, t)

  return (
    <Text fontWeight={600} variant={getTextVariant(headerTitle.length)}>
      {headerTitle}
    </Text>
  )
}
