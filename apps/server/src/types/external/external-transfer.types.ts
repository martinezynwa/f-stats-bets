type Player = {
  id: number
  name: string
}

type TeamDetail = {
  id: number
  name: string
  logo: string
}

export type Transfer = {
  date: string
  type: string
  teams: {
    in: TeamDetail
    out: TeamDetail
  }
}

export type ExternalTransferResponse = {
  player: Player
  update: string
  transfers: Transfer[]
}
