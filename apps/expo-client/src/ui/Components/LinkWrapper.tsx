import { Href, Link as LinkAlias } from 'expo-router'
import type { PropsWithChildren } from 'react'

interface LinkWrapperProps extends PropsWithChildren {
  href: string
  params?: Record<string, string>
  asChild?: boolean
  disabled?: boolean
}

const toQueryParams = (obj: Record<string, string>) => {
  return Object.entries(obj)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}

export const LinkWrapper = ({ href, params, children, asChild, disabled }: LinkWrapperProps) => {
  const updatedHref = (params ? `${href}?${toQueryParams(params)}` : href) as Href<string>

  return (
    <LinkAlias disabled={disabled} href={updatedHref} asChild={asChild}>
      {children}
    </LinkAlias>
  )
}
