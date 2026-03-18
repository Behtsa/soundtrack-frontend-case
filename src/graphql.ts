/*
  This module sets up our GraphQL client (urql), as well as the gql.tada library
  which provides typing for our GraphQL documents.
*/
import { initGraphQLTada } from 'gql.tada'
import { Client, fetchExchange } from 'urql'
import type { introspection } from './graphql.generated.d.ts'

export const graphql = initGraphQLTada<{
  disableMasking: true
  introspection: introspection
  scalars: {
    Url: string
    Date: string
  }
}>()

export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada'
export { readFragment, maskFragments } from 'gql.tada'

export const client = new Client({
  url: 'https://api.soundtrackyourbrand.com/v2',
  fetchOptions: {
    headers: {
      'x-user-agent': JSON.stringify({ platform: 'business' }),
    },
  },
  exchanges: [fetchExchange],
})
