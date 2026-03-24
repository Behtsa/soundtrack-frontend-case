import type { SearchResult } from '../../searchQueries'
import { SearchItem } from '../SearchItem'
import { unionMerge } from '@/lib/type-helpers'
import styles from './EditorialSections.module.css'

type EditorialSectionEdge = {
  node: {
    id: string
    title: string
    items: {
      edges: Array<{ node: SearchResult | null }>
    }
  }
}

export function EditorialSections({
  sections,
}: {
  sections: EditorialSectionEdge[] | null
}) {
  if (!sections) return null

  return (
    <>
      {sections.map(({ node }) => {
        // Recent searches section is generated on the client side.
        if (node.id.endsWith(':recent-searches')) return null

        return (
          <section key={node.id}>
            <h2>{node.title}</h2>
            <ul className={styles.itemsList}>
              {node.items.edges.map((item, index) => {
                if (!item.node) return null
                const merged = unionMerge(item.node)
                return (
                  <SearchItem key={merged.id || index} item={merged} />
                )
              })}
            </ul>
          </section>
        )
      })}
    </>
  )
}

