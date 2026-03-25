import { graphql } from '@/graphql'

/**
 * A GraphQL fragment for the `Displayable` interface.
 * Most types in the Soundtrack API implement this interface.
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

/** Builds an image URL from the `placeholder` template field. */
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
