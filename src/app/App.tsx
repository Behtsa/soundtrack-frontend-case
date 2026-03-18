import * as React from 'react'
import { useQuery } from 'urql'
import { Link, useLocation } from 'wouter'
import { graphql, type ResultOf } from '../graphql'
import { unionMerge } from '../lib/type-helpers'
import {
  DisplayableFragment,
  displayImageUrl,
  params2uri,
  uri2params,
  uri2url,
  url2uri,
} from '../lib/utils'
import './App.css'

export default function App(): React.ReactNode {
  // The 'wouter' library provides a very flexible router which you can use as you see fit.
  // Docs: https://github.com/molefrog/wouter
  const [location, navigate] = useLocation()
  /** Searches are made using a URI string which combines a query with an optional "section" (tab) */
  const params = uri2params(url2uri(location))

  // Docs: https://commerce.nearform.com/open-source/urql/docs/basics/react-preact/#queries
  const [result] = useQuery({
    query: SearchDoc,
    variables: { uri: params.uri, perSection: params.section ? 60 : 10 },
  })

  return (
    <main>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          const input = event.currentTarget.elements.namedItem(
            'query',
          ) as HTMLInputElement
          navigate(uri2url(params2uri({ ...params, query: input.value })))
        }}
      >
        <input
          name="query"
          type="search"
          size={30}
          defaultValue={params.query}
          placeholder="Search on Soundtrack"
        />
        <button type="submit" children="Search" />
      </form>

      <div className="results">
        {!!result.error && (
          <pre style={{ color: 'darkred' }}>
            GraphQL Error: {JSON.stringify(result.error, null, 2)}
          </pre>
        )}

        {/*
          Tabs enable the user to narrow down their search to a specific kind of result.
        */}
        {!!result.data?.editorialSearch.tabs && (
          <>
            <ul className="tabs">
              <li key="all" className="tab">
                <Link to={uri2url(params2uri({ ...params, section: '' }))}>
                  All
                </Link>
              </li>
              {result.data?.editorialSearch.tabs.map((tab) => {
                return (
                  <li key={tab.id} className="tab">
                    <Link to={uri2url(tab.id)}>{tab.display?.title}</Link>
                  </li>
                )
              })}
            </ul>
          </>
        )}

        {/*
          The search API returns a list of sections that the client is
          responsible for rendering as it sees fit.
        */}
        {result.data?.editorialSearch.sections.edges?.map(({ node }) => {
          // Recent searches section is generated on the client side,
          // feel free to ignore it or populate it yourself
          if (node.id.endsWith(':recent-searches')) return null
          return (
            <section key={node.id}>
              <h2>{node.title}</h2>
              <ul className="items-list">
                {node.items.edges.map(
                  (item: { node: SearchResult | null }, index) => {
                    // The explicit cast of `item.node` to `SearchResult` isn't
                    // necessary, and only provided in case you wish to extract
                    // this into a dedicated component.
                    if (!item.node) return null
                    // `unionMerge()` allows us to easily access fields on `node` without having to check __typename
                    const node = unionMerge(item.node)
                    return (
                      <li key={node.id || index} className="item">
                        <img src={displayImageUrl(node.display, 140)} alt="" />
                        <h4>
                          <a
                            // This could be a <Link> to a dedicated detail page or something else
                            href={`https://business.soundtrackyourbrand.com/search/${node.id}`}
                            target="_blank"
                            children={node.display?.title || node.id}
                          />
                        </h4>
                      </li>
                    )
                  },
                )}
              </ul>
            </section>
          )
        })}
      </div>
    </main>
  )
}

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
const SearchDoc = graphql(
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
