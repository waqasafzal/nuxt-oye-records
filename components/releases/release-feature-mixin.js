import gql from 'graphql-tag'

export const ReleaseFeature = {
  data: function () {
    return {
      release: null
    }
  },
  apollo: {
    // Query with parameters
    release () {
      return {
        query: gql`query Release($slug: String!) {
            release (slug: $slug){
                pk
                artistFirstName
                artistLastName
                title
                artistFirstName
                artistLastName
                hasTracks
                tracks {
                    url
                    title
                    position
                    release {
                        artistFirstName
                        artistLastName
                        title
                    }
                }
                availability {
                    status
                }
                slug
                thumbnailUrl
            }
        }
        `,
        variables () {
          return {
            slug: this.slug
          }
        }
      }
    }
  }
}
