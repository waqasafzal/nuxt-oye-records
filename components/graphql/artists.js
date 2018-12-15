import gql from 'graphql-tag'

export const artistFragment = gql`
  fragment Artist on ArtistType {
    pk
    slug
    name
    thumbnailUrl
  }
`
