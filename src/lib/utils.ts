import { graphql } from '../graphql'

/**
 * A GraphQL fragment for the `Displayable` GraphQL interface.
 * Many of the types available in the Soundtrack API implements this interface.
 * Fragments can be reused across multiple GraphQL documents.
 */
export const DisplayableFragment = graphql(/* GraphQL */ `
  fragment DisplayableFragment on Displayable {
    display {
      title
      image {
        placeholder
      }
      colors {
        primary {
          hex
        }
        secondary {
          hex
        }
      }
    }
  }
`)

/** Generates a valid URL for a displayable image utilizing the `placeholder` field. */
export function displayImageUrl(
  display:
    | { image?: { placeholder?: string | null } | null }
    | null
    | undefined,
  width: number,
  height = width,
) {
  return display?.image?.placeholder
    ?.replace('%w', width.toString())
    .replace('%h', height.toString())
}

export function uri2url(uri: string): string {
  const parts = uri.split(':')
  if (parts[0] === 'search') parts.shift()
  return '/' + parts.join('/')
}

export function url2uri(url: string): string {
  const parts = url.replace(/^\/|\/$/g, '').split('/')
  return 'search:' + parts.join(':')
}

export function uri2params(uri: string) {
  const parts = uri.split(':')
  return {
    uri,
    query: parts[0] === 'search' ? decodeURIComponent(parts[1]) : undefined,
    section: parts[2] === 'section' ? decodeURIComponent(parts[3]) : undefined,
  }
}

export function params2uri(uri: { query?: string; section?: string }): string {
  const parts = []
  if (uri.query) parts.push(encodeURIComponent(uri.query))
  if (uri.section) parts.push('section', encodeURIComponent(uri.section))
  return 'search:' + parts.join(':')
}
