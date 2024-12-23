import l from "lodash"

export function getNextId(ids: number[]) {
  const initialId = l.max(ids) || 0
  const nextId = initialId + 1
  return nextId
}
