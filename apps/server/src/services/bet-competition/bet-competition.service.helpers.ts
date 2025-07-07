import { BetEvaluated, BetEvaluatedWithPoints } from '@f-stats-bets/types'

export const countPointsForStandings = (betsEvaluated: BetEvaluated[]) => {
  const counted = betsEvaluated.reduce(
    (acc, betEvaluated) => {
      const { userId, fixtureResultPoints } = betEvaluated

      if (!acc[userId]) {
        acc[userId] = { userId }
      }

      if (fixtureResultPoints) {
        acc[userId].fixtureResultPoints =
          (acc[userId].fixtureResultPoints || 0) + fixtureResultPoints
      }

      return acc
    },
    {} as Record<string, BetEvaluatedWithPoints & { userId: string }>,
  )

  const sortedArray = Object.values(counted).sort(
    (a, b) => (b.fixtureResultPoints || 0) - (a.fixtureResultPoints || 0),
  )

  return sortedArray
}
