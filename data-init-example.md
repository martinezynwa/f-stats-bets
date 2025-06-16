# Data Initialization Guide

## Two Ways to Initialize Seed Data

### 1. Manual Initialization

Follow these steps in order:

1. Call `seed/init-all` with the following parameters:
- `tablesWithoutRelations`
- `tablesWithRelations`
2. Call `external/insert-fixtures`
3. Update `userId` in `mock.test.http` for `/bet-competitions` and `/bets` to match an existing user
4. Call `mock/bet-competitions`
5. Update the new `betCompetitionId` in `mock.test.http` for `/bets`
6. Call `mock/bets`

### 2. Automatic Initialization

This method automates all the previous steps, just need to call the endpoint:

Call `seed/init-all` with additional parameters:
- `seasons`
- `fixtureExternalLeagueIds`
- `fixtureDateFrom`
- `fixtureDateTo`

These parameters will create fixtures.

To also mock BetCompetition and Bet data, add:
- `shouldMockCustomData = true`

