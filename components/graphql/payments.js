import gql from 'graphql-tag'

export const cardDataFragment = gql`
  fragment CardData on CardDataType {
    expiryMonth
    expiryYear
    holderName
    number
  }
`
