1) call seed/init-all
2) call external/insert-fixtures
3) userId in `mock.test.http` for /bet-competitions and /bets should match with existing user
4) call mock/bet-competitions
5) update new betCompetitionId in `mock.test.http` for /bets
6) call mock/bets