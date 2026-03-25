import { type FormEvent } from 'react'
import { params2uri, uri2url } from '@/lib/utils'
import type { SearchRouteParams } from '../../types'
import styles from './SearchForm.module.css'

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
    <form onSubmit={handleSubmit} className={styles.searchBar}>
      <span className={styles.searchIcon} aria-hidden="true">⌕</span>
      <input
        autoComplete='off'
        className={styles.input}
        name="query"
        type="search"
        placeholder="Search on Soundtrack"
        value={inputValue}
        onChange={(event) => onValueChange(event.target.value)}
      />
      <button className={styles.submitButton} type="submit">Search</button>
    </form>
  )
}
