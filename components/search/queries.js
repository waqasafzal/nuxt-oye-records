import client from '~plugins/apollo'
import gql from 'graphql-tag'
import { release } from '../graphql/releases'

export const callReleaseSearchQuery = function (query, size, page, callback) {
  client.query({
    query: gql`query Search($query: String!, $size: Int!, $page: Int) {
        search(query: $query, size: $size, page: $page) {
            results {
                highlight
                ... on ReleaseSearchResult {
                    release {
                        ...Release
                        smallThumbnailUrl: thumbnailUrl(size:100)
                    }
                }
            }
            total
        }
    }
    ${release}  
    `,
    variables: {
      query: query,
      size: size,
      page: page
    }
  }).then(callback)
}
