export type PaginatedResponse<T> = {
  pages: {
    items: T[]
    nextCursor: string | null
    count: number
  }[]
}
