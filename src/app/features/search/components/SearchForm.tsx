import { params2uri, uri2url } from '@/lib/utils'
import type { SearchRouteParams } from '../types'

export function SearchForm({
  params,
  onNavigate,
}: {
  params: SearchRouteParams
  onNavigate: (to: string) => void
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const input = event.currentTarget.elements.namedItem('query') as HTMLInputElement
        onNavigate(uri2url(params2uri({ ...params, query: input.value })))
      }}
    >
      <input
        name="query"
        type="search"
        size={30}
        defaultValue={params.query}
        placeholder="Search on Soundtrack"
      />
      <button type="submit" children="Search" />
    </form>
  )
}

