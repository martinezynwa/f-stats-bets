import { TFunction } from 'i18next'

export const Route = {
  HOME: '/',
  PROFILE: '/profile',
  BET_COMPETITIONS_GLOBAL: '/bet-competition/global',
  BET_COMPETITIONS_JOINED: '/bet-competition/joined',
  BET_COMPETITIONS_USER_CREATED: '/bet-competition/user-created',
  BET_COMPETITIONS_CREATED: '/bet-competition/create',
} as const

export type RouteType = (typeof Route)[keyof typeof Route]

export const pathNameMapper: Record<RouteType, string> = {
  [Route.HOME]: 'header.title.home',
  [Route.PROFILE]: 'header.title.profile',
  [Route.BET_COMPETITIONS_GLOBAL]: 'header.title.globalCompetitions',
  [Route.BET_COMPETITIONS_JOINED]: 'header.title.joinedCompetitions',
  [Route.BET_COMPETITIONS_USER_CREATED]: 'header.title.userCreatedCompetitions',
  [Route.BET_COMPETITIONS_CREATED]: 'header.title.createCompetition',
}

export const getPathTitle = (path: string, t: TFunction) => {
  console.log('path', path)
  const routePath = path as RouteType

  return {
    shouldOverrideHeader: false,
    headerTitle: t(pathNameMapper[routePath]) || '',
  }
}
