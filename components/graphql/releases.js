/**
 * Created by tillkolter on 15/03/17.
 */

import gql from 'graphql-tag'

export const tracksFragment = gql`
    fragment Tracks on ReleaseTrackType {
        url
        title
        position
        release {
            pk
            slug
            name
            artistFirstName
            artistLastName
            title
            label
        }
    }
`
// Save the fragment into a variable
export const releaseDetails = gql`
    fragment ReleaseDetails on ArtikelType {
        pk
        title
        name
        artistFirstName
        artistLastName
        description
        format
        condition
        catalogueNumber
        originalReleasedAt
        releasedAt
        label
        genres {
            pk
            name
            slug
            parentGenre {
                pk
                name
                slug
            }
            subgenres {
                pk
                name
                slug
            }
        }
        price {
            currency
            gross
            grossLocalized
            net
        }
        availability {
            status
            priceRange  {
                maxPrice { gross, grossLocalized, currency }
                minPrice { gross, grossLocalized, currency }
            }
        }
        slug
        thumbnailUrl
        smallImageUrl: thumbnailUrl(size:400)
        addToCartUrl
        tracks {
            ...Tracks
        }
        mainGenre {
            pk
            name
            slug
            subgenres {
                pk
                name
                slug
            }
        }
        mainGenreSub {
            pk
            name
            slug
            parentGenre {
                pk
                name
                slug
            }
        }
        discogsUrl
    }
    ${tracksFragment}
`

export const releasePlayerInfo = gql`
    fragment ReleasePlayerInfo on ArtikelType {
        pk
        title
        name
        artistFirstName
        artistLastName
        tracks {
            ...Tracks
        }
    }
    ${tracksFragment}
`

export const release = gql`
    fragment Release on ArtikelType {
        pk
        title
        slug
        label
        format
        mainGenre {
            name
        }
        artistFirstName
        artistLastName
        name
        price {
            currency
            gross
        }
        description
        hasTracks
        availability {
            status
            priceRange  {
                maxPrice { gross, grossLocalized, currency },
                minPrice { gross, grossLocalized, currency }
            }
        }
        thumbnailUrl(size: 380)
        discogsUrl
    }
`

export const releasesConnections = gql`
    fragment Releases on ArtikelTypeConnection {
        edges {
            cursor
            node {
                ...Release
            }
        }
        pageInfo {
            hasNextPage
        }
    }
${release}`

export const newStatus = JSON.stringify({'status': 'new'})
export const backStatus = JSON.stringify({'status': 'back'})
export const upcomingStatus = JSON.stringify({'status': 'upcoming'})
