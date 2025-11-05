import { useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
import { Filters } from '../schemas/filterSchema'

export function useUrlFilters(): { filtersRaw: Record<string, string>; setParams: (obj: Record<string, string>) => void } {
  const [searchParams, setSearchParams] = useSearchParams()
  const filtersRaw = useMemo(() => {
    const obj: Record<string, string> = {}
    for (const [k, v] of searchParams.entries()) obj[k] = v
    return obj
  }, [searchParams])

  return { filtersRaw, setParams: (obj) => setSearchParams(obj) }
}