import gql from 'graphql-tag'

export const createChartsArchiveQuery = function (category, cursor) {
  return {
    query: gql`query ChartsArchive($category: String, $cursor: String) {
        charts(first: 25, category: $category, after: $cursor) {
            edges {
                node {
                    pk
                    slug
                    date
                    user {
                        firstName
                    }
                    artist {
                        name
                        homeLabel
                    }
                    imageUrl
                    name
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }`,
    variables: {
      category: category,
      cursor: cursor
    }
  }
}
