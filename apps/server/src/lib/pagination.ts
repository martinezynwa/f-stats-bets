import { TABLE_PAGE_SIZE } from '../constants/constants'

export const getPaginationInfo = (input: {
  totalItems: number
  pageSize?: string
  page?: string
}) => {
  const page = Number(input.page) || 1
  const pageSize = Number(input.pageSize) || TABLE_PAGE_SIZE

  const totalPages = Math.ceil(input.totalItems / pageSize)
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize

  return {
    startIndex,
    endIndex,
    totalPages,
    totalItems: input.totalItems,
  }
}
