export const Route = {
  HOME: '/',
  PROFILE: '/profile',
} as const

export type RouteType = (typeof Route)[keyof typeof Route]

export const pathNameMapper: Record<RouteType, string> = {
  [Route.HOME]: 'Home',
  [Route.PROFILE]: 'Profile',
}

export const getPathTitle = (path: string) => {
  const routePath = path as RouteType
  return {
    shouldOverrideHeader: false,
    pathName: pathNameMapper[routePath] || '',
  }
}
