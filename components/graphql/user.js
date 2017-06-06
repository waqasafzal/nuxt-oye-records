
import apolloClient from '~/plugins/apollo'
import gql from 'graphql-tag'

export const callSaveAddress = function (id, addressDict, callback) {
  apolloClient.mutate({
    mutation: gql`mutation SaveAddress($addressPk: ID, $addressJson: JSONString!) {
        saveAddress(addressJson: $addressJson, addressPk: $addressPk) {
            address {
                id
            }
        }
    }`,
    variables: {
      addressJson: JSON.stringify(addressDict),
      addressPk: id
    }
  }).then(callback)
}
