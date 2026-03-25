import type { SearchResult } from '../../searchQueries'
import { resolveSectionItemsLayout, type SectionItemsLayout } from '../../sectionLayout'
import { SearchItem } from '../SearchItem'
import { unionMerge } from '@/lib/type-helpers'
import styles from './EditorialSections.module.css'

type EditorialSectionEdge = {
  node: {
    id: string
    title: string
    component: string[]
    items: {
      edges: Array<{ node: SearchResult | null }>
    }
  }
}

function resolveListClass(layout: SectionItemsLayout): string {
  const classMap = {
    'track-list': styles.trackList,
    'mixed':      styles.mixedLayout,
    'fixed':      styles.fixedGrid,  // fixed cols: cards AND multi-col lists
    'list':       styles.list,       // single-column list (no breakpoint hints)
    'auto':       styles.autoGrid,
  }

  const key = layout.display === 'track-list' ? 'track-list'
    : layout.smallDisplay      ? 'mixed'
    : layout.colMode === 'fixed' ? 'fixed'   // check fixed before display type
    : layout.display === 'list'  ? 'list'
    : 'auto'

  const base = [styles.itemsList, classMap[key]]
  if (layout.style && '--rows' in layout.style) base.push(styles.rowsLimited)
  return base.join(' ')
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

        const layout = resolveSectionItemsLayout(node.component)

        return (
          <section key={node.id}>
            <h2>{node.title}</h2>
            <ul className={resolveListClass(layout)} style={layout.style}>
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

