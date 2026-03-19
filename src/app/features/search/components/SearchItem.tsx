import { displayImageUrl } from '@/lib/utils'
import { unionMerge } from '@/lib/type-helpers'
import type { SearchResult } from '../searchQueries'

export function SearchItem({ node }: { node: SearchResult }) {
  const merged = unionMerge(node)

  return (
    <li className="item">
      <img src={displayImageUrl(merged.display, 140)} alt="" />
      <h4>
        <a
          href={`https://business.soundtrackyourbrand.com/search/${merged.id}`}
          target="_blank"
          rel="noreferrer"
        >
          {merged.display?.title || merged.id}
        </a>
      </h4>
    </li>
  )
}

