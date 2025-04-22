import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { Controller, useFormContext } from 'react-hook-form'

interface Props {
  name: string
  values: string[]
  onChange: (value: number) => void
  initialValue?: number
}

export const SwitchForm = ({ name, values, onChange, initialValue }: Props) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value } }) => (
        <SegmentedControl
          values={values}
          selectedIndex={initialValue ?? value}
          onChange={({ nativeEvent }) => {
            onChange(nativeEvent.selectedSegmentIndex)
          }}
        />
      )}
    />
  )
}
