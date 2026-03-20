import { useQuery } from 'urql'
import { SearchDoc } from './searchQueries'

type EditorialSearchParams = {
  uri: string
  section?: string
}

export function useEditorialSearch(params: EditorialSearchParams) {
  const [result] = useQuery({
    query: SearchDoc,
    variables: { uri: params.uri, perSection: params.section ? 60 : 10 },
  })

  return {
    result,
    tabs: result.data?.editorialSearch?.tabs ?? null,
    sections: result.data?.editorialSearch?.sections?.edges ?? null,
  }
}

