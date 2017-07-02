import client from '~plugins/apollo'
import gql from 'graphql-tag'
import { release } from '../graphql/releases'
import { artistFragment } from '../graphql/artists'

export const callReleaseSearchQuery = function (query, size, page, fields, callback, errorCallback) {
  client.query({
    query: gql`query Search($query: String!, $size: Int!, $page: Int, $fields: JSONString) {
        search(query: $query, size: $size, page: $page, docType: "release", fields: $fields) {
            results {
                highlight
                ... on ReleaseSearchResult {
                    release {
                        ...Release
                        smallThumbnailUrl: thumbnailUrl(size:120)
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
      page: page,
      fields: fields
    }
  }).then(callback).catch(errorCallback)
}

export const callArtistSearchQuery = function (query, size, callback, errorCallback) {
  client.query({
    query: gql`query Search($query: String!, $size: Int!) {
        search(query: $query, size: $size, docType: "artist") {
            results {
                highlight
                ... on ArtistSearchResult {
                    artist {
                        ...Artist
                        smallThumbnailUrl: thumbnailUrl(size:120)
                    }
                }
            }
            total
        }
    }
    ${artistFragment}  
    `,
    variables: {
      query: query,
      size: size
    }
  }).then(callback).catch(errorCallback)
}
