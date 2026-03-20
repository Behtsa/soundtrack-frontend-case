import { Link } from 'wouter'
import { params2uri, uri2url } from '@/lib/utils'
import type { SearchRouteParams } from '../types'

type Tab = {
  id: string
  display?: { title?: string | null } | null
}

export function SearchTabs({
  params,
  tabs,
}: {
  params: SearchRouteParams
  tabs: Tab[] | null
}) {
  if (!tabs) return null

  return (
    <ul className="tabs">
      <li key="all" className="tab">
        <Link to={uri2url(params2uri({ ...params, section: '' }))}>All</Link>
      </li>
      {tabs.map((tab) => {
        return (
          <li key={tab.id} className="tab">
            <Link to={uri2url(tab.id)}>{tab.display?.title}</Link>
          </li>
        )
      })}
    </ul>
  )
}

