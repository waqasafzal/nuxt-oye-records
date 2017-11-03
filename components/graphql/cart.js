/**
 * Created by tillkolter on 26/04/17.
 */

import gql from 'graphql-tag'
import {release} from '~/components/graphql/releases'

export const order = gql`
    fragment Order on OrderType {
        id
        pk
        price
        date
        total
        status
        porto
        isPaid
        paymentType
    }
`

export const oyeCart = gql`
    fragment OyeCart on OyeCartType {
        pk
        quantity
        vat
        totalAvailable
        totalAvailableNet
        lines(backorder: false) {
            release {
                ...Release
                releasedAt
            }
            quantity
            smallImageUrl
            notAvailable
            pricePerItem
            lineTotal
            backorder
        }
        preorderLines: lines(backorder: true) {
            release {
                ...Release
                releasedAt
            }
            quantity
            smallImageUrl
            notAvailable
            lineTotal
            backorder
        }
        cookie
        shippingOptions {
            isVatExcluded
            options {
                id
                name
                price
            }
        }
    }
    ${release}
`
