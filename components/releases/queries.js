import gql from 'graphql-tag'
import { releaseDetails } from '../graphql/releases'

import ReleaseList from '../releases/ReleaseList.vue'

export const createReleaseDetailsQuery = function (slug) {
  return {
    query: gql`query Release($slug: String!) {
        release (slug: $slug){
            ...ReleaseDetails
        }
    }
    ${releaseDetails}
    `,
    variables: {
      slug: slug
    }
  }
}

export const createReleaseBaseDetailsQuery = function (slug) {
  return {
    query: gql`query Release($slug: String!) {
        release (slug: $slug) {
            pk
            artistFirstName
            artistLastName
            title
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
            discogsUrl
        }
    }
    `,
    variables: {
      slug: slug
    }
  }
}

export const createReleaseListQuery = function (options = {}) {
  return {
    query: gql`query Releases($first: Int!, $after: String, $filterBy: JSONString!) {
        releases(first: $first, after: $after, filterBy: $filterBy) {
            ...Releases
        }
    }
    ${ReleaseList.fragments.releases}
    `,
    variables: {
      first: options.first || 30,
      after: options.after || '',
      filterBy: options.filterBy || JSON.stringify({})
    }
  }
}
