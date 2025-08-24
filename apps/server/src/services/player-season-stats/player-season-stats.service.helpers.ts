import { InsertPlayerSeasonStats, PlayerFixtureStats, PlayerSeasonStats } from '@f-stats-bets/types'
import { limitDecimalPlaces } from '../../lib/util'
import { RANKING_ELIGIBILITY_THRESHOLD } from '../../constants/constants'
import {
  GroupedStats,
  AccumulatedStats,
  GroupKey,
  PerGameStats,
  allPlayerSeasonStatsKeys,
  PlayerSeasonStatsSingleGameKeys,
} from './player-season-stats.service.types'

export const countPlayerSeasonStats = (
  playerFixtureStats: PlayerFixtureStats[],
  gamesPlayedInLeagues: { gamesPlayed: number; leagueId: number }[],
): InsertPlayerSeasonStats[] => {
  const groupedStats = groupPlayerFixtureStats(playerFixtureStats)

  return Object.entries(groupedStats).map(([_, fixtures]) => {
    const accumulatedStats = accumulateFixtureStats(fixtures)

    const gamesPlayedInLeague =
      gamesPlayedInLeagues.find(item => item.leagueId === fixtures[0].leagueId)?.gamesPlayed || 0

    const calculatedStats = calculatePerGameStats(accumulatedStats, fixtures, gamesPlayedInLeague)

    const keyAttributes = fixtures[0]

    return {
      playerId: keyAttributes.playerId,
      season: keyAttributes.season,
      leagueId: keyAttributes.leagueId,
      teamId: keyAttributes.teamId,
      ...accumulatedStats,
      ...calculatedStats,
    }
  })
}

export const groupPlayerFixtureStats = (stats: PlayerFixtureStats[]): GroupedStats =>
  stats.reduce((acc, curr) => {
    const key = `${curr.teamId}-${curr.leagueId}` as GroupKey
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(curr)
    return acc
  }, {} as GroupedStats)

export const accumulateFixtureStats = (fixtures: PlayerFixtureStats[]): AccumulatedStats =>
  fixtures.reduce(
    (acc, curr) => ({
      appearences: acc.appearences + (curr.minutes ? 1 : 0),
      lineups: acc.lineups + (curr.substitute === false ? 1 : 0),
      captain: acc.captain + (curr.captain ? 1 : 0),
      substitute: acc.substitute + (curr.substitute ? 1 : 0),
      minutes: acc.minutes + (curr.minutes || 0),
      rating: acc.rating + (curr.rating || 0),
      eligibileAppearencesForRating:
        acc.eligibileAppearencesForRating + (curr.minutes && curr.minutes > 5 ? 1 : 0),
      substitutesIn: acc.substitutesIn + (curr.substitute && curr.minutes ? 1 : 0),
      substitutesBench: acc.substitutesBench + (curr.substitute && !curr.minutes ? 1 : 0),
      goals: acc.goals + (curr.goals || 0),
      assists: acc.assists + (curr.assists || 0),
      conceded: acc.conceded + (curr.conceded || 0),
      saves: acc.saves + (curr.saves || 0),
      shotsTotal: acc.shotsTotal + (curr.shotsTotal || 0),
      shotsOn: acc.shotsOn + (curr.shotsOn || 0),
      passesTotal: acc.passesTotal + (curr.passesTotal || 0),
      passesKey: acc.passesKey + (curr.passesKey || 0),
      passesAccuracy: acc.passesAccuracy + (curr.passesAccuracy || 0),
    }),
    {
      appearences: 0,
      lineups: 0,
      captain: 0,
      substitute: 0,
      minutes: 0,
      eligibileAppearencesForRating: 0,
      rating: 0,
      substitutesIn: 0,
      substitutesBench: 0,
      goals: 0,
      assists: 0,
      conceded: 0,
      saves: 0,
      shotsTotal: 0,
      shotsOn: 0,
      passesTotal: 0,
      passesKey: 0,
      passesAccuracy: 0,
    },
  )

export const calculatePerGameStats = (
  stats: AccumulatedStats,
  fixtures: PlayerFixtureStats[],
  gamesPlayedInLeague: number,
): PerGameStats => {
  const { appearences, minutes } = stats

  return {
    position: getMostCommonValue(fixtures, 'position'),
    rating: stats.eligibileAppearencesForRating
      ? limitDecimalPlaces(stats.rating / stats.eligibileAppearencesForRating)
      : 0.0,
    eligibleForRanking: isEligibleForRanking(gamesPlayedInLeague, appearences),
    minutesPerGame: minutes ? minutes / appearences : 0,
    goalsAssists: stats.goals + stats.assists,
    goalsPerGame: stats.goals ? limitDecimalPlaces(stats.goals / appearences) : 0,
    goalsFrequency: minutes && stats.goals ? minutes / stats.goals : 0,
    assistsPerGame: stats.assists ? limitDecimalPlaces(stats.assists / appearences) : 0,
    assistsFrequency: minutes && stats.assists ? minutes / stats.assists : 0,
    concededPerGame: stats.conceded ? limitDecimalPlaces(stats.conceded / appearences) : 0,
    savesPerGame: stats.saves ? limitDecimalPlaces(stats.saves / appearences) : 0,
    shotsTotalPerGame: stats.shotsTotal ? limitDecimalPlaces(stats.shotsTotal / appearences) : 0,
    shotsOnPerGame: stats.shotsOn ? limitDecimalPlaces(stats.shotsOn / appearences) : 0,
    passesTotalPerGame: stats.passesTotal ? limitDecimalPlaces(stats.passesTotal / appearences) : 0,
    passesKeyPerGame: stats.passesKey ? limitDecimalPlaces(stats.passesKey / appearences) : 0,
  }
}

export const getMostCommonValue = (data: PlayerFixtureStats[], attributeName: 'position') => {
  const positionCounts = data.reduce((acc: Record<string, number>, player) => {
    const attributeValue = player[attributeName]

    if (attributeValue) {
      acc[attributeValue] = (acc[attributeValue] || 0) + 1
    }

    return acc
  }, {})

  const mostFrequentPosition = Object.keys(positionCounts).filter(
    k => positionCounts[k] === Math.max(...Object.values(positionCounts)),
  )

  return mostFrequentPosition[0]
}

export const isEligibleForRanking = (gamesPlayedInALeague: number, playerAppearences: number) =>
  playerAppearences >= gamesPlayedInALeague * RANKING_ELIGIBILITY_THRESHOLD

export const countAndEditPlayerSeasonStats = (
  playerSeasonStats: PlayerSeasonStats,
  playerFixtureStats: PlayerFixtureStats,
  gamesPlayedInALeague: number,
) => {
  const result = allPlayerSeasonStatsKeys.reduce(
    (acc, key) => {
      if (
        key === 'id' ||
        key === 'playerId' ||
        key === 'leagueId' ||
        key === 'teamId' ||
        key === 'season' ||
        key === 'position'
      ) {
        acc[key] = playerSeasonStats[key]

        return acc
      }

      if (key === 'rating') {
        const seasonAppearences = playerSeasonStats.appearences
        const seasonRating = playerSeasonStats.rating
        const eligibleForRating = playerFixtureStats.minutes! > 5

        if (seasonRating === 0 && !playerFixtureStats[key]) {
          acc[key] = 0

          return acc
        }

        if (seasonRating === 0 && playerFixtureStats[key]) {
          if (eligibleForRating) {
            acc[key] = limitDecimalPlaces(playerFixtureStats[key])

            return acc
          }

          acc[key] = 0

          return acc
        }

        if (!eligibleForRating) {
          acc[key] = seasonRating

          return acc
        }

        const updatedRating =
          (seasonRating * seasonAppearences + playerFixtureStats[key]!) / (seasonAppearences + 1)

        acc[key] = limitDecimalPlaces(updatedRating)

        return acc
      }

      if (
        key === 'goalsFrequency' ||
        key === 'assistsFrequency' ||
        key === 'minutesPerGame' ||
        key === 'goalsPerGame' ||
        key === 'assistsPerGame' ||
        key === 'concededPerGame' ||
        key === 'savesPerGame' ||
        key === 'shotsTotalPerGame' ||
        key === 'shotsOnPerGame' ||
        key === 'passesTotalPerGame' ||
        key === 'passesKeyPerGame'
      ) {
        const parsedKey = key.replace('PerGame', '') as PlayerSeasonStatsSingleGameKeys
        const played = !!playerFixtureStats.minutes

        if (played) {
          if (key === 'goalsFrequency' || key === 'assistsFrequency') {
            const parsed = key.replace('Frequency', '') as PlayerSeasonStatsSingleGameKeys
            const newTotalMinutes = playerSeasonStats.minutes + (playerFixtureStats.minutes ?? 0)

            const newTotalValue = playerSeasonStats[parsed] + (playerFixtureStats[parsed] ?? 0)

            acc[key] = newTotalValue === 0 ? 0 : newTotalMinutes / newTotalValue

            return acc
          }

          const newTotalValue = playerSeasonStats[parsedKey] + (playerFixtureStats[parsedKey] ?? 0)
          const newTotalAppearances =
            playerSeasonStats.appearences + (playerFixtureStats.minutes ? 1 : 0)

          const newValue = newTotalValue / newTotalAppearances
          const value = limitDecimalPlaces(newValue)
          acc[key] = value

          return acc
        }

        return acc
      }

      if (key === 'goalsAssists') {
        const playerSeasonStatValue = parseInt(playerSeasonStats[key] as unknown as string)

        acc[key] =
          (playerSeasonStatValue || 0) +
          (playerFixtureStats.goals || 0) +
          (playerFixtureStats.assists || 0)
      }

      if (
        key === 'appearences' ||
        key === 'eligibileAppearencesForRating' ||
        key === 'lineups' ||
        key === 'minutes' ||
        key === 'substitutesIn' ||
        key === 'substitutesBench' ||
        key === 'goals' ||
        key === 'assists' ||
        key === 'conceded' ||
        key === 'saves' ||
        key === 'shotsTotal' ||
        key === 'shotsOn' ||
        key === 'passesTotal' ||
        key === 'passesKey' ||
        key === 'passesAccuracy'
      ) {
        if (key === 'appearences') {
          acc[key] = !playerFixtureStats.minutes
            ? playerSeasonStats[key]
            : playerSeasonStats[key] + 1
          return acc
        }

        if (key === 'lineups') {
          acc[key] = playerFixtureStats.substitute
            ? playerSeasonStats[key]
            : playerSeasonStats[key] + 1
          return acc
        }

        if (key === 'substitutesIn') {
          acc[key] =
            playerFixtureStats.substitute && playerFixtureStats.minutes
              ? playerSeasonStats[key] + 1
              : playerSeasonStats[key]
          return acc
        }

        if (key === 'substitutesBench') {
          acc[key] =
            playerFixtureStats.substitute && !playerFixtureStats.minutes
              ? playerSeasonStats[key] + 1
              : playerSeasonStats[key]
          return acc
        }

        if (key === 'eligibileAppearencesForRating') {
          acc[key] =
            playerFixtureStats.minutes && playerFixtureStats.minutes > 5
              ? playerSeasonStats[key] + 1
              : playerSeasonStats[key]
          return acc
        }

        const playerSeasonStatValue = parseInt(playerSeasonStats[key] as unknown as string)
        const playerFixtureStatValue = parseInt(playerFixtureStats[key] as unknown as string)

        acc[key] = (playerSeasonStatValue || 0) + (playerFixtureStatValue || 0)

        return acc
      }

      if (key === 'eligibleForRanking') {
        acc[key] = isEligibleForRanking(
          gamesPlayedInALeague,
          playerSeasonStats.appearences + ((playerFixtureStats.minutes || 0) > 0 ? 1 : 0),
        )

        return acc
      }

      return acc
    },
    {} as Record<keyof PlayerSeasonStats, number | string | boolean>,
  )

  return result as unknown as PlayerSeasonStats //TODO fix this
}

export const getStatValue = (
  value: number | null | undefined,
  divisor: number | null | undefined,
  type: 'perGame' | 'frequency',
) => {
  if (!divisor || !value) return 0.0

  if (type === 'perGame') {
    return limitDecimalPlaces(value / divisor)
  } else if (type === 'frequency') {
    return limitDecimalPlaces(divisor / value)
  }
  return 0.0
}
