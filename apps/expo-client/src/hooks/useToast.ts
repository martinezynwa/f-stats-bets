import { Easing, Notifier } from 'react-native-notifier'

import { Colors } from '../ui'

interface Props {
  title: string
  description?: string
  duration?: number
  onPress?: () => void
  onHidden?: () => void
  hideOnPress?: boolean
  bounce?: boolean
}

export const useToast =
  () =>
  ({ title, description, duration = 3000, onPress, onHidden, hideOnPress, bounce }: Props) =>
    Notifier.showNotification({
      title,
      description,
      duration,
      showAnimationDuration: 300,
      showEasing: bounce ? Easing.bounce : undefined,
      onPress,
      onHidden,
      hideOnPress,
      componentProps: {
        containerStyle: {
          borderRadius: 12,
          backgroundColor: Colors.toastBackground,
          height: 70,
        },
        titleStyle: { color: Colors.toastTitle, fontSize: 16 },
        descriptionStyle: { color: Colors.toastDescription, fontSize: 14 },
      },
    })
