import { type FormEvent } from 'react'
import { params2uri, uri2url } from '@/lib/utils'
import type { SearchRouteParams } from '../types'

export function SearchForm({
  params,
  inputValue,
  onValueChange,
  onNavigate,
}: {
  params: SearchRouteParams,
  inputValue: string,
  onValueChange: (query: string) => void,
  onNavigate: (to: string) => void,
}) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onNavigate(uri2url(params2uri({ ...params, query: params.query })))
  }


  return (
    <form onSubmit={handleSubmit}>
      <input
        name="query"
        type="search"
        size={30}
        placeholder="Search on Soundtrack"
        value={inputValue}
        onChange={(event) => onValueChange(event.target.value)}
      />
      <button type="submit" children="Search" />
    </form>
  )
}
