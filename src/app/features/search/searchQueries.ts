import { graphql, type ResultOf } from '@/graphql'
import { DisplayableFragment } from '@/lib/utils'

/**
 * A GraphQL fragment for the different result types returned by the API.
 * Fragments can be reused across multiple GraphQL documents.
 */
export const SearchResultFragment = graphql(
  /* GraphQL */ `
    fragment SearchResultFragment on PlaylistArtistTrackAlbumBrowseCategory {
      __typename
      ...DisplayableFragment
      ... on Playlist {
        id
        presentAs
        shortDescription
      }
      ... on Schedule {
        id
        shortDescription
      }
      ... on BrowseCategory {
        id
        type
      }
      ... on Track {
        id
        artists {
          id
          name
        }
      }
      ... on Artist {
        id
      }
      ... on Album {
        id
        albumType
        releaseDate {
          timestamp
          precision
        }
      }
    }
  `,
  [DisplayableFragment],
)

/** Items in `editorialSearch.sections[].edges[].node.items.edges[].node` will have this type. */
export type SearchResult = ResultOf<typeof SearchResultFragment>

/**
 * The primary GraphQL document used to search for editorial content.
 * `graphql()` parses the GraphQL document into a AST in object form, while
 * gql.tada augments the returned object with type information.
 */
export const SearchDoc = graphql(
  /* GraphQL */ `
    query Search($uri: String!, $perSection: Int!) {
      editorialSearch(id: $uri) {
        id
        query
        tabs {
          id
          display {
            title
          }
        }
        sections(first: 10) {
          total
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              component
              items(first: $perSection) {
                edges {
                  node {
                    ...SearchResultFragment
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
  [SearchResultFragment],
)

