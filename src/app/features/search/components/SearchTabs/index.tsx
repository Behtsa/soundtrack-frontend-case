import { Link } from 'wouter'
import { params2uri, uri2url } from '@/lib/utils'
import type { SearchRouteParams } from '../../types'
import styles from './SearchTabs.module.css'

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
    <ul className={styles.tabs}>
      <li key="all" className={styles.tab}>
        <Link to={uri2url(params2uri({ ...params, section: '' }))}>All</Link>
      </li>
      {tabs.map((tab) => {
        const isActive = params.uri === tab.id
        return (
          <li key={tab.id} className={isActive ? `${styles.tab} ${styles.tabActive}` : styles.tab}>
            <Link to={uri2url(tab.id)}>{tab.display?.title}</Link>
          </li>
        )
      })}
    </ul>
  )
}

