import gql from 'graphql-tag'
import { tracksFragment } from '../graphql/releases'

export const createChartsDetailQuery = function(slug) {
  return {
    query: gql`
      query ChartsDetail($slug: String!) {
        chart(slug: $slug) {
          slug
          name
          imageUrl(width: 600, height: 384)
          createdAt
          relatedCharts {
            slug
            name
            createdAt
          }
          artist {
            slug
            name
            homeLabel
          }
          user {
            firstName
          }
          releases {
            rank
            release {
              pk
              slug
              thumbnailUrl(width: 120, height: 120)
              artistFirstName
              artistLastName
              label
              title
              price {
                gross
              }
              availability {
                status
              }
              tracks {
                ...Tracks
              }
            }
          }
        }
      }
      ${tracksFragment}
    `,
    variables: {
      slug: slug
    }
  }
}
