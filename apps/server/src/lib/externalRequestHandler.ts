import { ENDPOINTS, SUBENDPOINTS } from '../constants/enums'
import { ExternalResponse } from '../types/external/common'
import { logger } from './logger'

export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

interface ExternalRequestHandlerProps<T> {
  requestMethod?: RequestMethod
  endpoint: ENDPOINTS
  subEndpoint?: SUBENDPOINTS
  params?: Record<string, string | number | undefined>
  responseArray: T[]
}

export const externalRequestHandler = async <T>({
  requestMethod = RequestMethod.GET,
  params,
  endpoint,
  subEndpoint,
  responseArray,
}: ExternalRequestHandlerProps<T>): Promise<T[]> => {
  try {
    const url = new URL(`${process.env.API_FOOTBALL_HOST}${endpoint}${subEndpoint ?? ''}`)

    if (params && requestMethod !== RequestMethod.POST) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString())
        }
      })
    }

    const response = await fetch(url.toString(), {
      method: requestMethod,
      headers: { 'x-apisports-key': process.env.API_FOOTBALL_KEY! },
      ...(requestMethod === RequestMethod.POST && params ? { body: JSON.stringify(params) } : {}),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    if (response.headers.get('x-ratelimit-remaining') === '0') {
      console.log('rate limit at 0')
      await new Promise(resolve => setTimeout(resolve, 25000))
    }

    const data: ExternalResponse<T> = await response.json()
    const { current: currentPage, total: totalPages } = data.paging

    if (currentPage === totalPages) {
      Array.isArray(data.response)
        ? responseArray.push(...data.response)
        : responseArray.push(data.response)
      return responseArray
    }

    Array.isArray(data.response)
      ? responseArray.push(...data.response)
      : responseArray.push(data.response)

    return externalRequestHandler<T>({
      endpoint,
      subEndpoint,
      params: { ...params, page: currentPage + 1 },
      responseArray,
    })
  } catch (error) {
    await logger({
      type: 'ERROR',
      action: 'Fetch error',
      message: `Error during API call for endpoint: ${process.env.API_FOOTBALL_HOST}${endpoint}${subEndpoint}`,
    })
    throw new Error(
      `Error during API call for endpoint: ${process.env.API_FOOTBALL_HOST}${endpoint}${subEndpoint}`,
    )
  }
}
