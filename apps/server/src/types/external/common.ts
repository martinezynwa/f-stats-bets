type ExternalResponseParameters = {
  id: string
}

type ExternalResponseError = Record<string, string>

type ExternalResponsePaging = {
  current: number
  total: number
}

export type ExternalResponse<T> = {
  get: string
  parameters: ExternalResponseParameters
  errors: ExternalResponseError
  results: number
  paging: ExternalResponsePaging
  response: T[] | T
}
