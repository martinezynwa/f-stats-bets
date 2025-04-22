import React, { FC, ReactNode, useState } from 'react'
import { FieldValues, FormProvider, UseFormReturn } from 'react-hook-form'
import { View } from 'react-native'

import { SubmitButton as SubmitButtonAlias, SubmitButtonProps } from '../Components/SubmitButton'

interface Props<T extends FieldValues> {
  children?:
    | ReactNode
    | ((props: { submitting: boolean; SubmitButton: FC<SubmitButtonProps> }) => ReactNode)
  onSubmit?: () => Promise<void>
  form: UseFormReturn<T>
}

export const Form = <T extends FieldValues>({ children, onSubmit, form }: Props<T>) => {
  const [submitting, setSubmitting] = useState(false)

  const hasErrors = Object.values(form.formState.errors).length > 0

  const handlePress = async () => {
    if (!onSubmit) return
    try {
      setSubmitting(true)
      await onSubmit()
    } finally {
      setSubmitting(false)
    }
  }

  const SubmitButton: FC<SubmitButtonProps> = ({ title, loading, danger, disabled, fullWidth }) => (
    <View style={{ paddingTop: 4 }}>
      <SubmitButtonAlias
        title={title}
        loading={loading ?? submitting}
        danger={danger}
        disabled={hasErrors || submitting || disabled}
        fullWidth={fullWidth}
        onPress={handlePress}
      />
    </View>
  )

  return (
    <FormProvider {...form}>
      <View>
        {children && typeof children === 'function'
          ? children({ submitting, SubmitButton })
          : children}
      </View>
    </FormProvider>
  )
}
