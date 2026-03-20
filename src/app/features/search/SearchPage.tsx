import * as React from 'react'
import { useLocation } from 'wouter'
import { uri2params, url2uri } from '@/lib/utils'
import { useEditorialSearch } from './useEditorialSearch'
import { SearchForm } from './components/SearchForm'
import { SearchTabs } from './components/SearchTabs'
import { EditorialSections } from './components/EditorialSections'
import { ErrorDisplay } from '@/components/ErrorDisplay'
import './SearchPage.css'

export function SearchPage(): React.ReactNode {
  const [location, navigate] = useLocation()
  const params = uri2params(url2uri(location))

  const { result, tabs, sections } = useEditorialSearch({
    uri: params.uri,
    section: params.section,
  })

  return (
    <main>
      <SearchForm params={params} onNavigate={navigate} />

      <div className="results">
        <ErrorDisplay error={result.error} title="GraphQL Error" />

        <SearchTabs params={params} tabs={tabs} />
        <EditorialSections sections={sections} />
      </div>
    </main>
  )
}

