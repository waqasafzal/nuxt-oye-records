import gql from 'graphql-tag'
import {releasePlayerInfo} from './releases'

export const createChartsArchiveQuery = function(category, cursor) {
  return {
    query: gql`
      query ChartsArchive($category: String, $cursor: String) {
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
      }
    `,
    variables: {
      category: category,
      cursor: cursor
    }
  }
}

export const bestsellerCharts = gql`
    query Bestseller($filterBy: JSONString!, $imageTag: String!) {
        releases(first: 10, filterBy: $filterBy) {
            edges {
                node {
                    slug
                    name
                    thumbnailUrl(size: 120)
                    ...ReleasePlayerInfo
                    price {
                        gross
                    }
                    availability {
                        status
                    }
                }
            }
        }
        defaultThumbnailUrl(
            imageType: "charts"
            tag: $imageTag
            width: 600
            height: 384
        )
    }
    ${releasePlayerInfo}
`

export const createChartsOverviewQuery = function(month) {
  return {
    query: gql`
        query Charts($month: Int!, $filterBy: JSONString!) {
            artistCharts: charts(category: "artist", month: $month) {
                edges {
                    node {
                        pk
                        slug
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
            }
            staffCharts: charts(category: "staff", month: $month) {
                edges {
                    node {
                        pk
                        slug
                        user {
                            firstName
                        }
                        imageUrl
                        name
                    }
                }
            }
            bestsellers: releases(first: 10, filterBy: $filterBy) {
                edges {
                    node {
                        slug
                        name
                        thumbnailUrl(size: 120)
                        ...ReleasePlayerInfo
                        price {
                            gross
                        }
                        availability {
                            status
                        }
                    }
                }
            }
            weeklyBestsellerThumb: defaultThumbnailUrl(
                imageType: "charts"
                tag: "weekly"
                width: 410
                height: 208
            )
            monthlyBestsellerThumb: defaultThumbnailUrl(
                imageType: "charts"
                tag: "monthly"
                width: 410
                height: 208
            )
            metaGenres {
                name
                slug
            }
        }
        ${releasePlayerInfo}
    `,
    variables: {
      month: month.value + 1,
      filterBy: JSON.stringify ({
        status: 'bestsellers',
        year_month: `${new Date ().getFullYear ()}-${month.value + 1}`
      })
    }
  }
  //   prefetch() {
  //   return {
  //     month: currentMonth.value + 1,
  //     filterBy: JSON.stringify({
  //       status: 'bestsellers',
  //       year_month: `${new Date().getFullYear()}-${currentMonth.value + 1}`
  //     })
  //   }
  // },
  //   update: data => {
  //     return {
  //       artistCharts: data.artistCharts,
  //       staffCharts: data.staffCharts,
  //       bestsellers: data.bestsellers,
  //       weeklyBestsellerThumb: data.weeklyBestsellerThumb,
  //       monthlyBestsellerThumb: data.monthlyBestsellerThumb,
  //       genres: data.metaGenres
  //     }
  //   }
  // }
}
