import { displayImageUrl } from '@/lib/utils'
import type { UnionMerge } from '@/lib/type-helpers'
import type { SearchResult } from '../../searchQueries'
import styles from './SearchItem.module.css'

type SearchMergedResult = UnionMerge<SearchResult>

export type SearchItemVariant = 'list' | 'card'

const typeStyleMap: Record<string, string> = {
  Artist:         styles.artist,
  Track:          styles.track,
  Album:          styles.album,
  Playlist:       styles.playlist,
  BrowseCategory: styles.browseCategory,
}

function ItemContent({ item, variant }: { item: SearchMergedResult; variant: SearchItemVariant }) {
  const img = <img src={displayImageUrl(item.display, 140)} alt={item.display?.title ?? ''} />

  switch (item.__typename) {
    case 'BrowseCategory':
      return <>{img}</>

    case 'Artist':
      if (variant === 'list') {
        return (
          <>
            {img}
            <div className={styles.info}>
              <span className={styles.title}>{item.display?.title}</span>
              <span className={styles.subtitle}>Artist</span>
            </div>
          </>
        )
      }
      return (
        <>
          {img}
          <span className={styles.title}>{item.display?.title}</span>
        </>
      )

    case 'Track':
      return (
        <>
          {img}
          <span className={styles.title}>{item.display?.title}</span>
        </>
      )

    case 'Album':
      return (
        <>
          {img}
          <div className={variant === 'list' ? styles.info : styles.cardInfo}>
            <span className={variant === 'list' ? styles.title : styles.cardTitle}>
              {item.display?.title}
            </span>
            <span className={variant === 'list' ? styles.subtitle : styles.cardSubtitle}>
              {item.albumType}
            </span>
          </div>
        </>
      )

    case 'Playlist':
      return (
        <>
          {img}
          <div className={variant === 'list' ? styles.info : styles.cardInfo}>
            <span className={variant === 'list' ? styles.title : styles.cardTitle}>
              {item.display?.title}
            </span>
            <span className={variant === 'list' ? styles.subtitle : styles.cardSubtitle}>
              {item.shortDescription}
            </span>
          </div>
        </>
      )

    default:
      return (
        <>
          {img}
          <span>{item.display?.title || item.id}</span>
        </>
      )
  }
}

export function SearchItem({ item, variant = 'card' }: { item: SearchMergedResult; variant?: SearchItemVariant }) {
  const typeClass = typeStyleMap[item.__typename ?? ''] ?? ''
  const variantClass = styles[variant]

  return (
    <li className={[styles.item, typeClass, variantClass].filter(Boolean).join(' ')}>
      <a
        href={`https://business.soundtrackyourbrand.com/search/${item.id}`}
        target="_blank"
        rel="noreferrer"
        className={styles.link}
      >
        <ItemContent item={item} variant={variant} />
      </a>
    </li>
  )
}
