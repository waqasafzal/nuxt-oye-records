
export const addressEquals = function (address1, address2) {
  return address1.firstName === address2.firstName &&
    address1.lastName === address2.lastName &&
    address1.company === address2.company &&
    address1.street === address2.street &&
    address1.number === address2.number &&
    address1.addressExtra === address2.addressExtra &&
    address1.city === address2.city &&
    address1.zip === address2.zip &&
    address1.country === address2.country
}
