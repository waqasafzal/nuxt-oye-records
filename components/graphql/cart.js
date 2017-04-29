/**
 * Created by tillkolter on 26/04/17.
 */

import gql from 'graphql-tag'

export const oyeCart = gql`
    fragment OyeCart on OyeCartType {
        pk
        quantity
        totalAvailable
        totalAvailableNet
        lines {
            release {
                pk
                slug
                artistFirstName
                artistLastName
                title
                price {
                    currency
                    gross
                }
                availability {
                    priceRange {
                        minPrice {
                            gross
                        }
                        maxPrice {
                            gross
                        }
                    }
                }
            }
            quantity
            smallImageUrl
            notAvailable
            lineTotal
            preorder
        }
        cookie
    }`
