import { useState, useEffect, useMemo, type ReactNode } from 'react'
import { useLocation } from 'wouter'
import { params2uri, uri2params, url2uri, uri2url } from '@/lib/utils'
import { useEditorialSearch } from './useEditorialSearch'
import { SearchForm } from './components/SearchForm'
import { SearchTabs } from './components/SearchTabs'
import { EditorialSections } from './components/EditorialSections'
import { ErrorDisplay } from '@/components/ErrorDisplay'
import { useDebounceValue } from '@/hooks/useDebounceValue'
import { SEARCH_DEBOUNCE_TIME } from './searchConstants'
import styles from './SearchPage.module.css'

export function SearchPage(): ReactNode {
  const [location, navigate] = useLocation()
  const params = uri2params(url2uri(location))

  const [searchText, setSearchText] = useState<string>(params.query ?? '')

  const debouncedSearchText = useDebounceValue(searchText, SEARCH_DEBOUNCE_TIME)

  /** Normalize the query to be used in the URL. */
  const normalizedQuery = debouncedSearchText.trim() || undefined

  const searchUri = useMemo(
    () => params2uri({ query: normalizedQuery, section: params.section }),
    [normalizedQuery, params.section],
  )

  const { result, tabs, sections } = useEditorialSearch({
    uri: searchUri,
    section: params.section,
  })

  /** When the URL changes (tabs, submit, back/forward), keep the input in sync with the route. */
  useEffect(() => {
    setSearchText(params.query ?? '')
  }, [location])

  /** When the debounced search changes (semantically), update the URL. */
  useEffect(() => {
    if (!normalizedQuery) {
      navigate(uri2url(params2uri({ ...params, query: '', section: '' })))
      return
    }
    const nextUrl = uri2url(params2uri({ ...params, query: normalizedQuery }))
    if (nextUrl !== location) {
      navigate(nextUrl)
    }
  }, [normalizedQuery])

  return (
    <main className={styles.pageMain}>
      <SearchForm
        params={params}
        inputValue={searchText}
        onValueChange={setSearchText}
        onNavigate={navigate}
      />

      <div className={styles.results}>
        <ErrorDisplay error={result.error} title="GraphQL Error" />

        <SearchTabs params={params} tabs={tabs} />
        <EditorialSections sections={sections} />
      </div>
    </main>
  )
}
