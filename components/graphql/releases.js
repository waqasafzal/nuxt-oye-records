/**
 * Created by tillkolter on 15/03/17.
 */

import gql from 'graphql-tag'

// Save the fragment into a variable
export const releaseDetails = gql`
    fragment ReleaseDetails on ArtikelType {
        pk
        title
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
        addToCartUrl
        tracks {
            url
            title
            position
            releasePosition
            release {
                artistFirstName
                artistLastName
                title
            }
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
`

export const releasePlayerInfo = gql`
    fragment ReleasePlayerInfo on ArtikelType {
        pk
        title
        artistFirstName
        artistLastName
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
    }
`

export const release = gql`
    fragment Release on ArtikelType {
        pk
        title
        slug
        label
        artistFirstName
        artistLastName
        price {
            currency
            gross
        }
        hasTracks
        availability {
            status
            priceRange  {
                maxPrice { gross, grossLocalized, currency },
                minPrice { gross, grossLocalized, currency }
            }
        }
        thumbnailUrl
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
