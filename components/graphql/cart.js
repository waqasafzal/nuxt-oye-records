/**
 * Created by tillkolter on 26/04/17.
 */

import gql from 'graphql-tag'
import {release} from '~/components/graphql/releases'

export const oyeCart = gql`
    fragment OyeCart on OyeCartType {
        pk
        quantity
        totalAvailable
        totalAvailableNet
        lines(preorder: false) {
            release {
                ...Release
            }
            quantity
            smallImageUrl
            notAvailable
            lineTotal
            preorder
        }
        preorderLines: lines(preorder: true) {
            release {
                ...Release
            }
            quantity
            smallImageUrl
            notAvailable
            lineTotal
            preorder
        }
        cookie
        shippingOptions {
            id
            name
            price
        }
    }
  ${release}
`
