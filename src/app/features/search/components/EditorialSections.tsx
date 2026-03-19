import type { SearchResult } from '../searchQueries'
import { SearchItem } from './SearchItem'
import { unionMerge } from '@/lib/type-helpers'

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
  sections?: EditorialSectionEdge[] | null
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
            <ul className="items-list">
              {node.items.edges.map((item, index) => {
                if (!item.node) return null
                const merged = unionMerge(item.node)
                return (
                  <SearchItem key={merged.id || index} node={item.node} />
                )
              })}
            </ul>
          </section>
        )
      })}
    </>
  )
}

