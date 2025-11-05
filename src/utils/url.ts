/**
 * Helper utilities for URLSearchParams parsing.
 */

/**
 * Convert a URLSearchParams instance into two plain objects:
 * - `initial`: keys mapped to their current string values (as present in the URL)
 * - `empty`: same keys mapped to empty strings (useful as defaultValues for forms)
 *
 * @param {URLSearchParams} searchParams URLSearchParams from React Router's useSearchParams
 * @returns {{ initial: Record<string,string>, empty: Record<string,string> }}
 */
export function parseSearchParams(searchParams: URLSearchParams) {
  const initial: Record<string, string> = {}
  const empty: Record<string, string> = {}

  searchParams.forEach((value, key) => {
    initial[key] = value
    empty[key] = ''
  })

  return { initial, empty }
}

export default parseSearchParams
