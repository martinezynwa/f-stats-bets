/* eslint-disable @typescript-eslint/no-explicit-any */
export const jsonToCsv = (json: any[], order: string) => {
  const columns = order.split(',')

  const csv = json.map(item => columns.map(column => item[column]).join(','))

  return [order, ...csv]
}
