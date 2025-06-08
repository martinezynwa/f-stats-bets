import { FixturesBetsContainer } from '../Fixtures/fixtures-bets-container'
import { FixturesContainer } from '../Fixtures/fixtures-container'

export const Home = () => {
  //TODO get preffered way to display home page from user settings
  const showBets = true

  return showBets ? <FixturesBetsContainer /> : <FixturesContainer />
}
