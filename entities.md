# Entity Definitions

## Fixture

A `Fixture` entity has the following characteristics:

- Can only be created when related entities exist:
  - `Season`
  - `League`
  - `Team`
- Once created, its relation to `FixtureRound` must be established

## FixtureRound

A FixtureRound entity has the following characteristics:

- Serves as an identifier for multiple fixtures within a round
- Can only be created after a `Fixture` is created
- Default state contains `hasStarted === false`
- `hasStarted` is changed to `true` once at least one Fixture with the matching `FixtureRound.id` is in completed state
