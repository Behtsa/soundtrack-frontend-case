import { displayImageUrl } from '@/lib/utils'
import type { UnionMerge } from '@/lib/type-helpers'
import type { SearchResult } from '../searchQueries'

type SearchMergedResult = UnionMerge<SearchResult>

export function SearchItem({ item }: { item: SearchMergedResult }) {
  return (
    <li className="item">
      <img src={displayImageUrl(item.display, 140)} alt="" />
      <h4>
        <a
          href={`https://business.soundtrackyourbrand.com/search/${item.id}`}
          target="_blank"
          rel="noreferrer"
        >
          {item.display?.title || item.id}
        </a>
      </h4>
    </li>
  )
}

